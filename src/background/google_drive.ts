import type { TCreateHeadersArgs, TSyncData } from "./types";

const SYNC_FILE_NAME = "epub_reader_sync_data.json";
const MIME_TYPE = "application/json";
const CONTENT_TYPE = MIME_TYPE;

export default class GoogleDrive {
  static createHeaders({ token, isJson = false }: TCreateHeadersArgs) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (isJson) {
      headers["Content-Type"] = CONTENT_TYPE;
    }

    return headers;
  }

  static async readSyncFile(token: string, fileId: string): Promise<TSyncData> {
    try {
      const url = new URL(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
      );

      url.searchParams.append("alt", "media");

      const headers = GoogleDrive.createHeaders({ token, isJson: true });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
      });

      return await response.json();
    } catch (error) {
      console.error("Error reading sync file:", error);
      throw error;
    }
  }

  static async findSyncFile(token: string) {
    try {
      const url = new URL(`https://www.googleapis.com/drive/v3/files`);

      url.searchParams.append("spaces", "appDataFolder");
      url.searchParams.append("q", `name = '${SYNC_FILE_NAME}'`);
      url.searchParams.append("fields", "files(id, name, mimeType)");

      const headers = GoogleDrive.createHeaders({ token, isJson: true });

      const response = await fetch(url.toString(), {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (data.files && data.files.length > 0) {
        return data.files[0];
      }

      return null;
    } catch (error) {
      console.error("Error finding sync file:", error);
      throw error;
    }
  }

  /**
   * Read the current remote sync data plus its HTTP ETag so we can merge
   * other devices' progress instead of blindly overwriting it.
   */
  static async readSyncFileWithEtag(
    token: string,
    fileId: string,
  ): Promise<{ data: TSyncData; etag: string | null }> {
    const url = new URL(`https://www.googleapis.com/drive/v3/files/${fileId}`);

    url.searchParams.append("alt", "media");

    const headers = GoogleDrive.createHeaders({ token, isJson: true });
    const response = await fetch(url.toString(), { method: "GET", headers });

    if (!response.ok) {
      return { data: {}, etag: null };
    }

    const etag = response.headers.get("ETag");

    let data: TSyncData = {};

    try {
      data = (await response.json()) as TSyncData;
    } catch {
      data = {};
    }

    return { data: data || {}, etag };
  }

  static async updateSyncFile(
    token: string,
    fileId: string,
    data: TSyncData,
    allowRetry = true,
  ): Promise<unknown> {
    try {
      // Merge with the latest remote: local progress wins per book, but books
      // only present on another device are preserved.
      const { data: remoteData, etag } = await GoogleDrive.readSyncFileWithEtag(
        token,
        fileId,
      );
      const mergedData: TSyncData = { ...remoteData, ...data };

      const fileMetadata = {
        mimeType: MIME_TYPE,
      };

      const form = new FormData();

      form.append(
        "metadata",
        new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }),
      );

      form.append(
        "file",
        new Blob([JSON.stringify(mergedData)], { type: MIME_TYPE }),
      );

      const url = new URL(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}`,
      );

      url.searchParams.append("uploadType", "multipart");

      const headers = GoogleDrive.createHeaders({ token });

      if (etag) {
        headers["If-Match"] = etag;
      }

      const response = await fetch(url.toString(), {
        method: "PATCH",
        headers,
        body: form,
      });

      // Lost the optimistic-concurrency race: re-read and retry once.
      if (response.status === 412 && allowRetry) {
        return GoogleDrive.updateSyncFile(token, fileId, data, false);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating sync file:", error);
      throw error;
    }
  }

  static async createSyncFile(token: string, data: TSyncData) {
    try {
      const fileMetadata = {
        name: SYNC_FILE_NAME,
        parents: ["appDataFolder"],
        mimeType: MIME_TYPE,
      };
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }),
      );
      form.append(
        "file",
        new Blob([JSON.stringify(data)], { type: MIME_TYPE }),
      );

      const url = new URL(`https://www.googleapis.com/upload/drive/v3/files`);

      url.searchParams.append("uploadType", "multipart");

      const headers = GoogleDrive.createHeaders({ token });

      const response = await fetch(url.toString(), {
        method: "POST",
        headers,
        body: form,
      });

      return await response.json();
    } catch (error) {
      console.error("Error creating sync file:", error);
      throw error;
    }
  }
}
