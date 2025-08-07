import type { TChapterData } from "@reader/types";

export const getChapterBySrc = (
  src: string | null,
  chapters: TChapterData[],
): TChapterData | null => {
  if (!src) {
    return null;
  }

  return chapters.find((item) => item?.pages?.[0]?.xhtmlName === src) || null;
};

export const getChapterByOrder = (
  index: number | null,
  chapters: TChapterData[],
): TChapterData | null => {
  if (index === null) {
    return null;
  }

  const newIndex = Math.max(0, index - 1);

  return chapters?.[newIndex];
};
