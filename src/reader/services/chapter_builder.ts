import type { TChapterCacheResult, TChapterData } from "@reader/types";
import PageBuilder from "./page_builder";
import type { Entry } from "@zip.js/zip.js";

export type TBuiltChapter = {
  cacheData: TChapterCacheResult;
  blobUrls: string[];
};

export default class ChapterBuilder {
  static async build(
    chapterData: TChapterData,
    imagesMap: Record<string, Entry>,
  ): Promise<TBuiltChapter> {
    const cacheData: TChapterCacheResult = {};
    const blobUrls: string[] = [];
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

      cacheData[page.pageNumber] = item?.html;

      if (item?.blobUrls?.length) {
        blobUrls.push(...item.blobUrls);
      }
    });

    return { cacheData, blobUrls };
  }
}
