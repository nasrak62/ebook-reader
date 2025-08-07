export const LOADING_EVENT = "loading-event";

export const dispatchLoadingEvent = (isLoading: boolean) => {
  window.dispatchEvent(
    new CustomEvent(LOADING_EVENT, { detail: { isLoading } }),
  );
};
