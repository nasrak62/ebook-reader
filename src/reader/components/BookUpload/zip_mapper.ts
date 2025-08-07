import { BlobReader, ZipReader } from "@zip.js/zip.js";
import type { Entry } from "@zip.js/zip.js";
import FileReader from "@reader/services/file_reader";

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

      if (
        filename.includes(".png") ||
        filename.includes(".jpg") ||
        filename.includes(".jpeg") ||
        filename.includes(".svg")
      ) {
        imagesMap[filename] = entryHandler;
        continue;
      }

      if (filename.includes(".xhtml")) {
        xhtmlMap[filename] = entryHandler;
        continue;
      }

      if (filename.includes(".opf")) {
        opfEntry = entryHandler;
        continue;
      }

      if (filename.includes(".ncx")) {
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
