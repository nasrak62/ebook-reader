import type {
  TChapterCacheResult,
  TChapterData,
  TChaptersCache,
} from "@reader/types";
import type { Entry } from "@zip.js/zip.js";
import ChapterBuilder from "./chapter_builder";

export default class ChapterManager {
  chaptersCache: TChaptersCache;

  constructor() {
    this.chaptersCache = {};
  }

  getCachedChapter(chapterId: string): TChapterCacheResult | null {
    return this.chaptersCache?.[chapterId] || null;
  }

  hasCachedChapter(chapterId: string): boolean {
    return this.getCachedChapter(chapterId) !== null;
  }

  deleteCacheKey(key: string) {
    if (this.chaptersCache?.[key] !== undefined) {
      delete this.chaptersCache[key];
    }
  }

  getCacheKeys() {
    const cacheKeys = Object.keys(this.chaptersCache);

    return cacheKeys;
  }

  async build(
    chapterDataList: TChapterData[],
    imagesMap: Record<string, Entry>,
  ) {
    const chaptersToFetch: TChapterData[] = [];

    for (const chapter of chapterDataList) {
      if (this.chaptersCache?.[chapter?.id]) {
        continue;
      }

      chaptersToFetch.push(chapter);
    }

    const tasks = chaptersToFetch.map((item) => {
      return ChapterBuilder.build(item, imagesMap);
    });

    const results = await Promise.all(tasks);

    results.forEach((item, index) => {
      const chapter = chaptersToFetch[index];

      if (chapter) {
        this.chaptersCache[chapter.id] = item;
      }
    });
  }
}
