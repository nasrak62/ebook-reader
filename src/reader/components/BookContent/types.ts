import type { TChapterData, TEbookMetaData } from "@reader/types";

export type TUpdateChapter = {
  selectedChapterData: TChapterData | null;
  setSelectedChapterData: React.Dispatch<
    React.SetStateAction<TChapterData | null>
  >;
};

export type TBookContentProps = {
  dataMap: TEbookMetaData;
} & TUpdateChapter;
