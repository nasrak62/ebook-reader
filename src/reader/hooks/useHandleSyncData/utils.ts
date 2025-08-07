import { COMMUNICATION_MESSAGES } from "../../../background/communication_utils";
import type { TSyncChapterData, TSyncData } from "../../../background/types";
import type {
  THandleSigninResult,
  TLoadSavedProgressArgs,
  TSaveCurrentProgressArgs,
} from "./types";

export const areProgressInstanceEqual = (
  first: TSyncChapterData | null,
  second: TSyncChapterData | null,
): boolean => {
  return (
    first?.pageNumber === second?.pageNumber &&
    first?.chapterName === second?.chapterName &&
    first?.chapterIndex === second?.chapterIndex &&
    first?.name === second?.name
  );
};

export const isAuthentication = async () => {
  const response = await chrome.runtime.sendMessage({
    action: COMMUNICATION_MESSAGES.GOOGLE_IS_AUTHENTICATED,
  });

  if (!response) {
    console.error("Failed to get response");

    return false;
  }

  if (response?.success) {
    return true;
  }

  return false;
};

const findSyncFile = async () => {
  const findFileResponse = await chrome.runtime.sendMessage({
    action: COMMUNICATION_MESSAGES.DRIVE_FIND_FILE,
  });

  if (!findFileResponse.success) {
    return null;
  }

  return findFileResponse?.file || null;
};

const readSyncFile = async (fileId: string): Promise<TSyncData | null> => {
  const response = await chrome.runtime.sendMessage({
    action: COMMUNICATION_MESSAGES.DRIVE_READ_FILE,
    fileId: fileId,
  });

  if (!response?.success) {
    console.error("error reading file");

    return null;
  }

  const fileData = response.file;

  if (!fileData) {
    console.log("file data is empty, skiping...");

    return null;
  }

  console.log({ fileData });

  return fileData;
};

const updateProgress = async (fileId: string, newData: TSyncData) => {
  const response = await chrome.runtime.sendMessage({
    action: COMMUNICATION_MESSAGES.DRIVE_UPDATE_FILE,
    fileId: fileId,
    data: newData,
  });

  return Boolean(response?.success);
};

const createProgress = async (newData: TSyncData) => {
  const response = await chrome.runtime.sendMessage({
    action: COMMUNICATION_MESSAGES.DRIVE_CREATE_FILE,
    data: newData,
  });

  return Boolean(response?.success);
};

export const getFileId = async () => {
  const file = await findSyncFile();

  return file?.id;
};

export const saveCurrentProgress = async ({
  fileId = null,
  oldData,
  epubId,
  progress,
}: TSaveCurrentProgressArgs) => {
  if (!epubId) {
    return false;
  }

  const newData = { ...oldData, [epubId]: progress };

  if (fileId) {
    const value = await updateProgress(fileId, newData);

    if (!value) {
      console.log("Create file error");
    }

    return value;
  }

  const value = await createProgress(newData);

  if (!value) {
    console.log("Create file error");
  }

  return value;
};

const loadSavedProgress = async ({
  oldData,
  epubId,
  progress,
}: TLoadSavedProgressArgs): Promise<THandleSigninResult> => {
  let file = await findSyncFile();

  if (file === null) {
    await saveCurrentProgress({
      oldData,
      epubId,
      progress,
    });
    file = await findSyncFile();
  }

  if (!file) {
    console.error("error getting sync file");
    return oldData;
  }
  const fileData = await readSyncFile(file.id);

  return fileData as TSyncData;
};

export const handleSignin = async ({
  oldData,
  epubId,
  progress,
}: TLoadSavedProgressArgs): Promise<THandleSigninResult> => {
  try {
    if (!epubId) {
      return oldData;
    }

    const isSignedin = await isAuthentication();

    if (!isSignedin) {
      return oldData;
    }

    const response = await chrome.runtime.sendMessage({
      action: COMMUNICATION_MESSAGES.GOOGLE_SIGNIN,
    });

    const isSucess = Boolean(response?.success);

    if (!isSucess) {
      console.error("Google Sign-in failed:", response?.error);

      return oldData;
    }

    return loadSavedProgress({ oldData, epubId, progress });
  } catch (error) {
    console.error(error);

    return oldData;
  }
};
