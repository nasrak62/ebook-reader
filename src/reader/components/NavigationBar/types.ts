import type { TNavigationItem } from "@reader/types";

export type THandleSetChapter = (
  src: string | null,
  chapterNumber: number | null,
) => () => void;

export type TNavigationBarProps = {
  items: TNavigationItem[];
  handleSetChapter: THandleSetChapter;
};
