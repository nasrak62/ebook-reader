import type { Entry } from "@zip.js/zip.js";

export default class FileReader<T = string> {
  dataExtractor(response: Response): Promise<T> {
    return response.text() as Promise<T>;
  }

  async readFileData(entry: Entry | null): Promise<T | null> {
    if (!entry) {
      return null;
    }

    const stream = new TransformStream();
    const responseValue = this.dataExtractor(new Response(stream.readable));

    const getDataFunc = entry.getData;

    if (!getDataFunc) {
      return null;
    }

    await entry.getData(stream.writable);

    const data = await responseValue;

    return data;
  }
}
