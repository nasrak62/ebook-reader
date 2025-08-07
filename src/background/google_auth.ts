import { isTokenError } from "./auth_utils";

export default class GoogleAuth {
  static async getToken({
    interactive = false,
  }: {
    interactive?: boolean;
  }): Promise<string | null> {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive }, (tokenResult) => {
        if (typeof tokenResult === "string") {
          resolve(tokenResult);

          return;
        }

        if (isTokenError(tokenResult)) {
          const error = chrome.runtime.lastError?.message || "No Token";

          console.error(error);

          reject(error);

          return;
        }

        resolve(tokenResult.token || null);
      });
    });
  }

  static async revokeToken(token: string) {
    return new Promise((resolve) => {
      chrome.identity.removeCachedAuthToken({ token }, () => {
        console.log("Token revoked");
        resolve(true);
      });
    });
  }
}
