import type { Entry } from "@zip.js/zip.js";

export type TManifestItem = {
  href: string;
  mediaType: string;
};

export type TManifestItems = Record<string, TManifestItem>;

export type TNavigationItem = {
  id: string | null;
  playOrder: number | null;
  label: string | null;
  src: string | null;
  children: TNavigationItem[];
};

export type TPageData = {
  xhtmlName: string;
  xhtmlEntry: Entry;
  pageNumber: number;
};

export type TChapterCacheResult = Record<string, string | undefined>;
export type TChaptersCache = Record<string, TChapterCacheResult>;

export type TChapterData = {
  id: string;
  pages: TPageData[];
  currentPage: number;
  name: string;
  chapterIndex: number;
};

export type TReadingOrder = {
  name: string;
  src: string;
  mediaType: string;
};

export type TEbookMetaData = {
  imagesMap: Record<string, Entry>;
  xhtmlMap: Record<string, Entry>;
  manifestItems: TManifestItems;
  readingOrder: TReadingOrder[];
  fileHandler: File;
  navigation: TNavigationItem[];
  title: string;
  chaptersData: TChapterData[];
  id: string;
};

export type TRelevantChapters = {
  currentChapter: TChapterData;
  previousChapter: TChapterData;
  nextChapter: TChapterData;
};
