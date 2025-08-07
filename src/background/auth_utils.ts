export const isTokenError = (
  tokenResult: chrome.identity.GetAuthTokenResult,
): boolean => {
  if (!tokenResult || !tokenResult.token || chrome.runtime.lastError?.message) {
    return true;
  }

  return false;
};
