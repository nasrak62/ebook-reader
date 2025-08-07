import type { TChapterData, TEbookMetaData } from "@reader/types";

export type TBookUploadProps = {
  dataMap: TEbookMetaData | null;
  setDataMap: React.Dispatch<React.SetStateAction<TEbookMetaData | null>>;
  setSelectedChapterData: React.Dispatch<
    React.SetStateAction<TChapterData | null>
  >;
};
