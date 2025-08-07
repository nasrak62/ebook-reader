import { useCallback, useEffect, useRef, useState } from "react";
import type { TSyncChapterData, TSyncData } from "../../../background/types";
import {
  areProgressInstanceEqual,
  getFileId,
  handleSignin,
  saveCurrentProgress,
} from "./utils";
import type { TChapterData } from "@reader/types";

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

  const handleInterval = useCallback(
    (controller: AbortController) => {
      console.log({ epubId, progress });
      if (epubId === null || progress === null) {
        return;
      }

      const timeout = setInterval(async () => {
        const effecitveFileId = await getFileId();

        await saveCurrentProgress({
          fileId: effecitveFileId,
          oldData: syncData || {},
          epubId,
          progress,
        });
      }, 15000);

      controller.signal.addEventListener(
        "abort",
        () => {
          if (timeout) {
            clearTimeout(timeout);
          }
        },
        {},
      );
    },
    [epubId, progress, syncData],
  );

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

  const handleSync = useCallback(async () => {
    await handleSigninWrapper();
  }, [handleSigninWrapper]);

  useEffect(() => {
    handleSync();
  }, [handleSync]);

  useEffect(() => {
    const controller = new AbortController();
    handleInterval(controller);

    return () => {
      controller.abort();
    };
  }, [handleInterval]);

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
