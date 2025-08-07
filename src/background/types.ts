import type { COMMUNICATION_MESSAGES } from "./communication_utils";

export type TObjectValues<T extends Record<string, unknown>> = T[keyof T];

export type TChromeSendResponse = (response?: unknown) => void;

export type TSyncChapterData = {
  name: string;
  chapterIndex: number;
  pageNumber: number;
  chapterName: string;
};

export type TSyncData = Record<string, TSyncChapterData>;

export type TMessageData = {
  action: TObjectValues<typeof COMMUNICATION_MESSAGES>;
  fileId?: string | undefined;
  data?: TSyncData | undefined;
};

export type TCreateHeadersArgs = { token: string; isJson?: boolean };
