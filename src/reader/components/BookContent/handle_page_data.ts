import { dispatchLoadingEvent } from "@reader/hooks/useHandleLoading/loading_events";
import { dispatchSyncPageZoomEvent } from "@reader/hooks/useHandleZoom/zoom_utils";
import type ChapterManager from "@reader/services/chapter_manager";
import type { TChapterData, TEbookMetaData } from "@reader/types";

export const handleGetPageData = async (
  manager: ChapterManager | null,
  element: HTMLDivElement | null,
  dataMap: TEbookMetaData,
  selectedChapterData: TChapterData | null,
  currentPageNumber: number,
) => {
  const chpaterId = selectedChapterData?.id;

  console.log({ chpaterId, manager, element });

  if (!chpaterId || !manager || !element || !selectedChapterData) {
    return;
  }

  if (!manager.hasCachedChapter(chpaterId)) {
    dispatchLoadingEvent(true);
  }
  const chapterIndex = dataMap.chaptersData.findIndex((item) => {
    return item.id === chpaterId;
  });

  if (chapterIndex === -1) {
    dispatchLoadingEvent(false);
    return;
  }

  const chaptersData = [selectedChapterData];

  if (chapterIndex - 1 > 0) {
    chaptersData.push(dataMap.chaptersData[chapterIndex - 1]);
  }

  if (chapterIndex + 1 < dataMap.chaptersData.length) {
    chaptersData.push(dataMap.chaptersData[chapterIndex + 1]);
  }

  await manager.build(chaptersData, dataMap.imagesMap);

  const cacheKeys = manager.getCacheKeys();
  const currentIds = chaptersData.map((item) => item.id);

  for (const key of cacheKeys) {
    if (!currentIds.includes(key)) {
      manager.deleteCacheKey(key);
    }
  }

  if (!manager.hasCachedChapter(chpaterId)) {
    return;
  }

  const pagesData = manager.getCachedChapter(chpaterId);
  const pageData = pagesData?.[currentPageNumber];

  if (!pageData) {
    dispatchLoadingEvent(false);
    return;
  }

  element.innerHTML = pageData;

  dispatchLoadingEvent(false);
  dispatchSyncPageZoomEvent();
};
