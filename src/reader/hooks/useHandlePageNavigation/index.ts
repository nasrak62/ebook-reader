import { useCallback, useMemo } from "react";
import type { TUseHandlePageNavigationArgs } from "./types";

const useHandlePageNavigation = ({
  setSelectedChapterData,
  selectedChapterData,
  dataMap,
}: TUseHandlePageNavigationArgs) => {
  const effectiveSelectedChapter = useMemo(() => {
    return selectedChapterData || dataMap.chaptersData?.[0] || null;
  }, [dataMap.chaptersData, selectedChapterData]);

  const chapterName = effectiveSelectedChapter?.name || "Label Error";
  const currentPageNumber = effectiveSelectedChapter?.currentPage || 0;
  const currentPage =
    effectiveSelectedChapter?.pages?.[currentPageNumber] || null;

  const lastPage = Math.max(
    (effectiveSelectedChapter?.pages?.length || 0) - 1,
    0,
  );

  const nextPageButtonDisabled = currentPageNumber >= lastPage;
  const prevPageButtonDisabled = currentPageNumber <= 0;

  const handlePrevPage = useCallback(() => {
    setSelectedChapterData((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        currentPage: Math.max((prev?.currentPage || 0) - 1, 0),
      };
    });
  }, [setSelectedChapterData]);

  const handleNextPage = useCallback(() => {
    setSelectedChapterData((prev) => {
      if (!prev) {
        return prev;
      }

      const currentLastPage = Math.max(prev.pages.length - 1, 0);

      return {
        ...prev,
        currentPage: Math.min((prev?.currentPage || 0) + 1, currentLastPage),
      };
    });
  }, [setSelectedChapterData]);

  return {
    handleNextPage,
    handlePrevPage,
    nextPageButtonDisabled,
    prevPageButtonDisabled,
    effectiveSelectedChapter,
    currentPage,
    currentPageNumber,
    chapterName,
  };
};

export default useHandlePageNavigation;
