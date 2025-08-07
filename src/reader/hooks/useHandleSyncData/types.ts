import type { TSyncChapterData, TSyncData } from "../../../background/types";

export type TSaveCurrentProgressArgs = {
  fileId?: string | null;
  oldData: TSyncData;
  epubId: string;
  progress: TSyncChapterData;
};

export type TLoadSavedProgressArgs = {
  oldData: TSyncData;
  epubId: string;
  progress: TSyncChapterData;
};

export type THandleSigninResult = TSyncData;
