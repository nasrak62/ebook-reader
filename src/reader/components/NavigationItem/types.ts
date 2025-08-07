import type { TNavigationItem } from "@reader/types";
import type { THandleSetChapter } from "../NavigationBar/types";

export type TNavigationItemProps = {
  item: TNavigationItem;
  handleSetChapter: THandleSetChapter;
  level?: number;
};
