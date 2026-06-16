import type { Entry } from "@zip.js/zip.js";
import BlobReader from "@reader/services/blob_reader";
import {
  buildEntryIndex,
  resolveEntry,
} from "@reader/components/BookUpload/path_utils";

export type TFixedImagesResult = {
  html: string;
  blobUrls: string[];
};

const XLINK_NS = "http://www.w3.org/1999/xlink";

export const fixHTMLImages = async (
  htmlValue: string,
  imagesMap: Record<string, Entry>,
): Promise<TFixedImagesResult> => {
  const parser = new DOMParser();
  const docValue = parser.parseFromString(htmlValue, "text/html");
  const blobReader = new BlobReader();
  const imageIndex = buildEntryIndex(imagesMap);
  const blobUrls: string[] = [];

  // <img src> plus SVG <image href> / <image xlink:href>
  const imgs = Array.from(docValue.querySelectorAll("img, image"));

  for (const img of imgs) {
    const isSvgImage = img.tagName.toLowerCase() === "image";
    const src =
      img.getAttribute("src") ||
      img.getAttribute("href") ||
      img.getAttributeNS(XLINK_NS, "href");

    if (!src) {
      continue;
    }

    const imageData = resolveEntry(imageIndex, src);

    if (!imageData) {
      continue;
    }

    const data = await blobReader.readFileData(imageData);

    if (!data) {
      continue;
    }

    const blobUrl = URL.createObjectURL(data);
    blobUrls.push(blobUrl);

    if (isSvgImage) {
      img.setAttribute("href", blobUrl);
      img.setAttributeNS(XLINK_NS, "href", blobUrl);
    } else {
      img.setAttribute("src", blobUrl);
    }
  }

  const finalHtml = new XMLSerializer().serializeToString(docValue);

  return { html: finalHtml, blobUrls };
};
