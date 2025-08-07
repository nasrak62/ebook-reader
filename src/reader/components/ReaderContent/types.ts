import type { TBookUploadProps } from "../BookUpload/types";
import type { TChapterData } from "@reader/types";

export type TReaderContentProps = {
  selectedChapterData: TChapterData | null;
} & TBookUploadProps;
