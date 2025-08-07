import type { TNavigationItem } from "@reader/types";

const parseNavigationItems = (navMap: Element | null): TNavigationItem[] => {
  const items: TNavigationItem[] = [];

  const rawItems = navMap?.querySelectorAll(":scope > navPoint");

  if (!rawItems) {
    return items;
  }

  for (const rawItem of rawItems) {
    const id = rawItem.getAttribute("id");
    const playOrder = rawItem.getAttribute("playOrder");
    const label = rawItem.querySelector("navLabel text")?.textContent || null;
    let src = rawItem.querySelector("content")?.getAttribute("src") || null;

    src = src?.split("#")?.[0] || null;

    const children = parseNavigationItems(rawItem);

    items.push({
      id,
      playOrder: playOrder !== null ? parseInt(playOrder, 10) : playOrder,
      label,
      src,
      children,
    });
  }

  return items;
};

export const parseToc = async (tocXml: string | null) => {
  const navigation: TNavigationItem[] = [];
  let title = "";

  if (!tocXml) {
    return {
      navigation,
      title,
    };
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(tocXml, "application/xml");
  title = xmlDoc.querySelector("docTitle text")?.textContent || "Untitled Book";
  const navMap = xmlDoc.querySelector("navMap");

  if (!navMap) {
    console.error("Invalid toc.ncx: Missing navMap");

    return {
      title,
      navigation,
    };
  }

  navigation.push(...parseNavigationItems(navMap));

  navigation.sort((a, b) => {
    return (a.playOrder || 0) - (b.playOrder || 0);
  });

  return {
    navigation,
    title,
  };
};
