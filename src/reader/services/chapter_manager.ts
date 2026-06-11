import type {
  TChapterCacheResult,
  TChapterData,
  TChaptersCache,
} from "@reader/types";
import type { Entry } from "@zip.js/zip.js";
import ChapterBuilder from "./chapter_builder";

export default class ChapterManager {
  chaptersCache: TChaptersCache;
  blobUrlsByChapter: Record<string, string[]>;

  constructor() {
    this.chaptersCache = {};
    this.blobUrlsByChapter = {};
  }

  getCachedChapter(chapterId: string): TChapterCacheResult | null {
    return this.chaptersCache?.[chapterId] || null;
  }

  hasCachedChapter(chapterId: string): boolean {
    return this.getCachedChapter(chapterId) !== null;
  }

  deleteCacheKey(key: string) {
    this.revokeChapter(key);

    if (this.chaptersCache?.[key] !== undefined) {
      delete this.chaptersCache[key];
    }
  }

  /** Revoke every blob URL created for a chapter so images don't leak. */
  revokeChapter(key: string) {
    const urls = this.blobUrlsByChapter?.[key];

    if (urls) {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }

      delete this.blobUrlsByChapter[key];
    }
  }

  revokeAll() {
    for (const key of Object.keys(this.blobUrlsByChapter)) {
      this.revokeChapter(key);
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
        this.chaptersCache[chapter.id] = item.cacheData;
        this.blobUrlsByChapter[chapter.id] = item.blobUrls;
      }
    });
  }
}
