import { useCallback, useEffect, useRef, useState } from "react";
import type { TSyncChapterData, TSyncData } from "../../../background/types";
import {
  areProgressInstanceEqual,
  getFileId,
  handleSignin,
  saveCurrentProgress,
} from "./utils";
import type { TChapterData } from "@reader/types";

const SAVE_INTERVAL_MS = 15000;

const useHandleSyncData = (
  epubId: string | null,
  progress: TSyncChapterData | null,
  setSelectedChapterData: React.Dispatch<
    React.SetStateAction<TChapterData | null>
  >,
  chapters: TChapterData[],
) => {
  const [syncData, setSyncData] = useState<TSyncData | null>(null);
  const epubIdRef = useRef<string | null>(null);
  const prevProgress = useRef<TSyncChapterData | null>(progress);

  // Latest values mirrored into refs so the save interval can read them
  // without being torn down and recreated on every page turn.
  const progressRef = useRef<TSyncChapterData | null>(progress);
  const syncDataRef = useRef<TSyncData | null>(syncData);
  const fileIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    syncDataRef.current = syncData;
  }, [syncData]);

  const handleSigninWrapper = useCallback(async () => {
    try {
      const canUpdateSyncData =
        syncData === null || epubIdRef?.current !== epubId;
      const canHandleFlow =
        canUpdateSyncData && epubId !== null && progress !== null;

      if (!canHandleFlow) {
        return;
      }

      epubIdRef.current = epubId;

      const newData = await handleSignin({
        oldData: syncData || {},
        epubId,
        progress,
      });

      setSyncData(newData);

      const epubData = newData?.[epubId];

      if (!epubData) {
        return;
      }

      const realChpaterData = chapters?.[epubData.chapterIndex];

      if (!realChpaterData) {
        return;
      }

      setSelectedChapterData({
        ...realChpaterData,
        currentPage: epubData.pageNumber,
      });
    } catch (error) {
      console.error(error);
    }
  }, [syncData, epubId, progress, chapters, setSelectedChapterData]);

  useEffect(() => {
    handleSigninWrapper();
  }, [handleSigninWrapper]);

  // One stable interval per book; reads the latest progress/syncData from refs.
  useEffect(() => {
    if (epubId === null) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const currentProgress = progressRef.current;

        if (!currentProgress) {
          return;
        }

        if (!fileIdRef.current) {
          fileIdRef.current = (await getFileId()) ?? null;
        }

        await saveCurrentProgress({
          fileId: fileIdRef.current ?? null,
          oldData: syncDataRef.current || {},
          epubId,
          progress: currentProgress,
        });
      } catch (error) {
        console.error(error);
      }
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [epubId]);

  useEffect(() => {
    if (
      epubId &&
      progress &&
      syncData &&
      !areProgressInstanceEqual(progress, prevProgress?.current)
    ) {
      prevProgress.current = progress;
      setSyncData((prev) => {
        return {
          ...prev,
          [epubId]: progress,
        };
      });
    }
  }, [epubId, progress, syncData]);
};

export default useHandleSyncData;
