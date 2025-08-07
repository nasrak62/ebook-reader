import {
  COMMUNICATION_MESSAGES,
  handleCreateDriveFile,
  handleFindDriveFile,
  handleGoogleSignIn,
  handleGoogleSignout,
  handleIsGoogleAuthenticated,
  handleReadDriveFile,
  handleUpdateDriveFile,
} from "./communication_utils";
import type { TMessageData } from "./types";

export default class DriveCommunicationManager {
  constructor() {
    this.handleEvents();
  }

  handleEventsLogin(
    message: TMessageData,
    sendResponse: (response?: unknown) => void,
  ) {
    console.log({ action: message.action });

    if (message.action === COMMUNICATION_MESSAGES.GOOGLE_SIGNIN) {
      handleGoogleSignIn(sendResponse);

      return true;
    }

    if (message.action === COMMUNICATION_MESSAGES.GOOGLE_SIGNOUT) {
      handleGoogleSignout(sendResponse);

      return true;
    }

    if (message.action === COMMUNICATION_MESSAGES.GOOGLE_IS_AUTHENTICATED) {
      handleIsGoogleAuthenticated(sendResponse);

      return true;
    }

    if (message.action === COMMUNICATION_MESSAGES.DRIVE_FIND_FILE) {
      handleFindDriveFile(sendResponse);

      return true;
    }

    if (message.action === COMMUNICATION_MESSAGES.DRIVE_READ_FILE) {
      handleReadDriveFile(sendResponse, message.fileId || null);

      return true;
    }

    if (message.action === COMMUNICATION_MESSAGES.DRIVE_CREATE_FILE) {
      handleCreateDriveFile(sendResponse, message.data || null);

      return true;
    }

    if (message.action === COMMUNICATION_MESSAGES.DRIVE_UPDATE_FILE) {
      handleUpdateDriveFile(
        sendResponse,
        message.data || null,
        message.fileId || null,
      );

      return true;
    }

    return false;
  }

  handleEvents() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      return this.handleEventsLogin(message, sendResponse);
    });
  }
}
