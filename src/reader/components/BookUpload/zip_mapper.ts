import { BlobReader, ZipReader } from "@zip.js/zip.js";
import type { Entry } from "@zip.js/zip.js";
import FileReader from "@reader/services/file_reader";

const IMAGE_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".avif",
  ".bmp",
  ".svg",
];

export const buildZipMappers = async (fileHandler: File) => {
  const imagesMap: Record<string, Entry> = {};
  const xhtmlMap: Record<string, Entry> = {};
  let tocEntry: Entry | null = null;
  let opfEntry: Entry | null = null;
  let tocFile = null;
  let opfFile = null;

  const fileReader = new FileReader();
  const blobReader = new BlobReader(fileHandler);
  const reader = new ZipReader(blobReader);
  const entries = reader.getEntriesGenerator();

  let canLoop = true;

  while (canLoop) {
    try {
      const result = await entries.next();

      if (result.done) {
        canLoop = false;
      }

      const entryHandler = result.value as Entry;

      const filename = entryHandler?.filename;

      if (!filename) {
        continue;
      }

      const lowerName = filename.toLowerCase();

      if (
        IMAGE_EXTENSIONS.some((extension) => lowerName.endsWith(extension))
      ) {
        imagesMap[filename] = entryHandler;
        continue;
      }

      if (lowerName.endsWith(".xhtml") || lowerName.endsWith(".html")) {
        xhtmlMap[filename] = entryHandler;
        continue;
      }

      if (lowerName.endsWith(".opf")) {
        opfEntry = entryHandler;
        continue;
      }

      if (lowerName.endsWith(".ncx")) {
        tocEntry = entryHandler;
        continue;
      }
    } catch (error) {
      console.log(error);
      canLoop = false;
    }
  }

  tocFile = await fileReader.readFileData(tocEntry);
  opfFile = await fileReader.readFileData(opfEntry);

  return {
    imagesMap,
    xhtmlMap,
    tocFile,
    opfFile,
  };
};
