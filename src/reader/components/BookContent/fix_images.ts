import type { Entry } from "@zip.js/zip.js";
import BlobReader from "@reader/services/blob_reader";

export const fixHTMLImages = async (
  htmlValue: string,
  imagesMap: Record<string, Entry>,
): Promise<string> => {
  const parser = new DOMParser();
  const docValue = parser.parseFromString(htmlValue, "text/html");
  const imgs = docValue.querySelectorAll("img");
  const blobReader = new BlobReader();

  for (const img of imgs) {
    let src = img.getAttribute("src");

    if (!src) {
      continue;
    }

    if (src.startsWith("/")) {
      src = src.slice(1);
    }

    const imageData =
      imagesMap?.[src] ||
      imagesMap?.[`OEBPS/${src}`] ||
      imagesMap?.[src.replace("..", "OEBPS")];

    if (!imageData) {
      continue;
    }

    const data = await blobReader.readFileData(imageData);

    if (!data) {
      continue;
    }

    const blobUrl = URL.createObjectURL(data);

    img.setAttribute("src", blobUrl);
  }

  const finalHtml = new XMLSerializer().serializeToString(docValue);

  return finalHtml;
};
