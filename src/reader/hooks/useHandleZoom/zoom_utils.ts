import type { TZoomType } from "./types";

export const SYNC_PAGE_ZOOM_EVENT = "SYNC_PAGE_ZOOM_EVENT";

export const dispatchSyncPageZoomEvent = () => {
  window.dispatchEvent(new Event(SYNC_PAGE_ZOOM_EVENT));
};

export const ZOOM_TYPES = {
  ALL: "all" as const,
  IMAGES: "images" as const,
};

export const updateElementScale = (element: HTMLElement, scale: number) => {
  element.style.transform = `scale(${scale})`;
  element.style.transformOrigin = "top";
};

export const updateElementItemsScale = (
  element: HTMLElement | null,
  scale: number,
  zoomType: TZoomType,
) => {
  if (!element) {
    return;
  }

  if (zoomType === ZOOM_TYPES.ALL) {
    for (const child of element.children) {
      updateElementScale(child as HTMLElement, scale);
    }

    return;
  }

  const images = element.querySelectorAll("img");

  if (!images) {
    return;
  }

  for (const image of images) {
    updateElementScale(image, scale);
  }
};
