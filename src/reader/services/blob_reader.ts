import FileReader from "./file_reader";

export default class BlobReader<T = Blob> extends FileReader<T> {
  dataExtractor(response: Response): Promise<T> {
    return response.blob() as Promise<T>;
  }
}
