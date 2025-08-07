import { useMemo, useState } from "react";
import classes from "./style.module.css";

import type { TChapterData, TEbookMetaData } from "@reader/types";
import NavigationBar from "../NavigationBar";
import ReaderContent from "../ReaderContent";
import { getChapterByOrder, getChapterBySrc } from "./utils";
import useHandleSyncData from "@reader/hooks/useHandleSyncData";
import type { TSyncChapterData } from "../../../background/types";

export default function App() {
  const [dataMap, setDataMap] = useState<TEbookMetaData | null>(null);
  const [selectedChapterData, setSelectedChapterData] =
    useState<TChapterData | null>(null);

  const progress = useMemo(() => {
    if (!selectedChapterData) {
      return null;
    }

    const data: TSyncChapterData = {
      name: selectedChapterData.id,
      chapterIndex: selectedChapterData.chapterIndex,
      pageNumber: selectedChapterData.currentPage,
      chapterName: selectedChapterData.name,
    };

    return data;
  }, [selectedChapterData]);

  useHandleSyncData(
    dataMap?.id || null,
    progress,
    setSelectedChapterData,
    dataMap?.chaptersData || [],
  );

  const handleSetChapter =
    (src: string | null, chapterNumber: number | null) => () => {
      if (!chapterNumber && !src) {
        return;
      }

      let nextChapter = getChapterBySrc(src, dataMap?.chaptersData || []);

      if (!nextChapter) {
        nextChapter = getChapterByOrder(
          chapterNumber,
          dataMap?.chaptersData || [],
        );
      }

      if (!nextChapter) {
        return;
      }

      setSelectedChapterData(nextChapter);
    };

  return (
    <div className={classes.container}>
      <NavigationBar
        items={dataMap?.navigation || []}
        handleSetChapter={handleSetChapter}
      />
      <ReaderContent
        dataMap={dataMap}
        setDataMap={setDataMap}
        setSelectedChapterData={setSelectedChapterData}
        selectedChapterData={selectedChapterData}
      />
    </div>
  );
}
