import GoogleAuth from "./google_auth";
import GoogleDrive from "./google_drive";
import type { TChromeSendResponse, TSyncData } from "./types";

export const COMMUNICATION_MESSAGES = {
  GOOGLE_SIGNIN: "GOOGLE_SIGNIN" as const,
  GOOGLE_SIGNOUT: "GOOGLE_SIGNOUT" as const,
  GOOGLE_IS_AUTHENTICATED: "GOOGLE_IS_AUTHENTICATED" as const,
  DRIVE_FIND_FILE: "DRIVE_FIND_FILE" as const,
  DRIVE_READ_FILE: "DRIVE_READ_FILE" as const,
  DRIVE_UPDATE_FILE: "DRIVE_UPDATE_FILE" as const,
  DRIVE_CREATE_FILE: "DRIVE_CREATE_FILE" as const,
};

const handleError = (sendResponse: TChromeSendResponse, error: unknown) => {
  sendResponse({ success: false, error });

  return false;
};

export const handleGoogleSignIn = async (sendResponse: TChromeSendResponse) => {
  try {
    const token = await GoogleAuth.getToken({ interactive: true });

    sendResponse({ success: true, token });

    return true;
  } catch (error) {
    return handleError(sendResponse, error);
  }
};

export const handleGoogleSignout = async (
  sendResponse: TChromeSendResponse,
) => {
  try {
    const token = await GoogleAuth.getToken({});

    if (token) {
      await GoogleAuth.revokeToken(token);
    }

    sendResponse({ success: true });

    return true;
  } catch (error) {
    return handleError(sendResponse, error);
  }
};

export const handleIsGoogleAuthenticated = async (
  sendResponse: TChromeSendResponse,
) => {
  try {
    const token = await GoogleAuth.getToken({});

    sendResponse({ success: true, isAuthenticated: Boolean(token) });

    return true;
  } catch (error) {
    return handleError(sendResponse, error);
  }
};

export const handleFindDriveFile = async (
  sendResponse: TChromeSendResponse,
) => {
  try {
    const token = await GoogleAuth.getToken({});

    if (!token) {
      return handleError(sendResponse, "Token Missing");
    }

    const file = await GoogleDrive.findSyncFile(token);
    sendResponse({ success: true, file });

    return true;
  } catch (error) {
    return handleError(sendResponse, error);
  }
};

export const handleReadDriveFile = async (
  sendResponse: TChromeSendResponse,
  fileId: string | null,
) => {
  try {
    if (!fileId) {
      return handleError(sendResponse, "Missing file id");
    }

    const token = await GoogleAuth.getToken({});

    if (!token) {
      return handleError(sendResponse, "Token Missing");
    }

    const file = await GoogleDrive.readSyncFile(token, fileId);

    sendResponse({ success: true, file });

    return true;
  } catch (error) {
    sendResponse({ success: false, error });

    return false;
  }
};

export const handleCreateDriveFile = async (
  sendResponse: TChromeSendResponse,
  data: TSyncData | null,
) => {
  try {
    console.log({ data });

    if (!data) {
      return handleError(sendResponse, "Missing sync data");
    }

    const token = await GoogleAuth.getToken({});

    if (!token) {
      return handleError(sendResponse, "Token Missing");
    }

    const file = await GoogleDrive.createSyncFile(token, data);

    console.log({ file });
    sendResponse({ success: true, file });

    return true;
  } catch (error) {
    sendResponse({ success: false, error });

    return false;
  }
};

export const handleUpdateDriveFile = async (
  sendResponse: TChromeSendResponse,
  data: TSyncData | null,
  fileId: string | null,
) => {
  try {
    if (!fileId) {
      return handleError(sendResponse, "Missing file id");
    }

    if (!data) {
      return handleError(sendResponse, "Missing sync data");
    }

    const token = await GoogleAuth.getToken({});

    if (!token) {
      return handleError(sendResponse, "Token Missing");
    }

    const file = await GoogleDrive.updateSyncFile(token, fileId, data);
    sendResponse({ success: true, file });

    return true;
  } catch (error) {
    sendResponse({ success: false, error });

    return false;
  }
};
