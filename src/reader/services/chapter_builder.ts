import type { TChapterCacheResult, TChapterData } from "@reader/types";
import PageBuilder from "./page_builder";
import type { Entry } from "@zip.js/zip.js";

export default class ChapterBuilder {
  static async build(
    chapterData: TChapterData,
    imagesMap: Record<string, Entry>,
  ): Promise<TChapterCacheResult> {
    const cacheData: TChapterCacheResult = {};
    const pages = chapterData.pages;
    const tasks = pages.map((page) => {
      return PageBuilder.build(page.xhtmlEntry, imagesMap);
    });

    const pagesResult = await Promise.all(tasks);

    pagesResult.forEach((item, index) => {
      const page = chapterData?.pages?.[index];

      if (!page) {
        return;
      }

      cacheData[page.pageNumber] = item;
    });

    return cacheData;
  }
}
