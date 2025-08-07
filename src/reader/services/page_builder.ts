import type { Entry } from "@zip.js/zip.js";
import FileReader from "./file_reader";
import { fixHTMLImages } from "@reader/components/BookContent/fix_images";
import { cleanHTML } from "@reader/components/BookContent/clean_dom";

export default class PageBuilder {
  static async build(pageEntry: Entry, imagesMap: Record<string, Entry>) {
    const fileReader = new FileReader();
    const data = await fileReader.readFileData(pageEntry);

    if (!data) {
      return;
    }

    const cleanedData = cleanHTML(data);

    const cleanedDataFixedImages = await fixHTMLImages(cleanedData, imagesMap);

    return cleanedDataFixedImages;
  }
}
