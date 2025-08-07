import { useCallback, useEffect, useRef, useState } from "react";
import {
  SYNC_PAGE_ZOOM_EVENT,
  updateElementItemsScale,
  ZOOM_TYPES,
} from "./zoom_utils";
import type { TZoomType } from "./types";

const useHandleZoom = (element: HTMLElement | null) => {
  const [zoomType, setZoomType] = useState<TZoomType>(ZOOM_TYPES.ALL);
  const currentZoom = useRef(1);

  const handleZoomIn = useCallback(() => {
    currentZoom.current = Math.min(currentZoom.current + 0.1, 4);

    updateElementItemsScale(element, currentZoom.current, zoomType);
  }, [element, zoomType]);

  const handleZoomOut = useCallback(() => {
    currentZoom.current = Math.max(currentZoom.current - 0.1, 0.1);

    updateElementItemsScale(element, currentZoom.current, zoomType);
  }, [element, zoomType]);

  const handleZoomType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value as TZoomType;

      setZoomType(newValue);
    },
    [],
  );

  const handleSyncZoom = useCallback(() => {
    updateElementItemsScale(element, currentZoom.current, zoomType);
  }, [element, zoomType]);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(SYNC_PAGE_ZOOM_EVENT, handleSyncZoom, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [handleSyncZoom]);

  return {
    currentZoom,
    handleZoomType,
    handleZoomIn,
    handleZoomOut,
    zoomType,
    setZoomType,
  };
};

export default useHandleZoom;
