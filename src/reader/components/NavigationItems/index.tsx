import type { TNavigationItemsProps } from "./types";
import NavigationItem from "../NavigationItem";
import { useMemo } from "react";

const NavigationItems = ({
  items,
  handleSetChapter,
  level = 0,
}: TNavigationItemsProps) => {
  const cleanedItems = useMemo(() => {
    return items.map((item) => {
      const src = item.src;
      const subChildren = item.children.filter(
        (child) => child?.src && child.src !== src,
      );

      return {
        ...item,
        children: subChildren,
      };
    });
  }, [items]);

  return cleanedItems.map((item) => {
    return (
      <>
        <NavigationItem
          item={item}
          level={level}
          handleSetChapter={handleSetChapter}
        />

        <NavigationItems
          items={item.children}
          handleSetChapter={handleSetChapter}
          level={level + 1}
        />
      </>
    );
  });
};

export default NavigationItems;
