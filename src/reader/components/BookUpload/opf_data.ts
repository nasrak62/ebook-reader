import type {
  TManifestItem,
  TManifestItems,
  TReadingOrder,
} from "@reader/types";

export const parseOpf = async (opfXml: string | null) => {
  if (!opfXml) {
    return {
      readingOrder: [],
      manifestItems: {},
    };
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(opfXml, "application/xml");
  const manifest = xmlDoc.querySelector("manifest");
  const spine = xmlDoc.querySelector("spine");
  const hasData = Boolean(manifest && spine);

  if (!hasData) {
    console.error("Invalid opf file or spine");

    return {
      readingOrder: [],
      manifestItems: {},
    };
  }

  const manifestItems: TManifestItems = {};
  const items = manifest?.querySelectorAll("item") || [];

  for (const item of items) {
    const itemId = item.getAttribute("id") || "";
    const href = item.getAttribute("href");
    const mediaType = item.getAttribute("media-type");

    manifestItems[itemId] = {
      href,
      mediaType,
    } as TManifestItem;
  }

  const readingOrder: TReadingOrder[] = [];
  const spineItems = spine?.querySelectorAll("itemref") || [];

  for (const spineItem of spineItems) {
    const id = spineItem.getAttribute("idref");

    if (!id) {
      continue;
    }

    readingOrder.push({
      name: id,
      src: manifestItems?.[id].href || "",
      mediaType: manifestItems?.[id].mediaType || "",
    });
  }

  return { readingOrder, manifestItems };
};
