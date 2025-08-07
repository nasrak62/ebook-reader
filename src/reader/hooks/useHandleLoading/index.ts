import { useCallback, useEffect, useState } from "react";
import type { TEventFunction } from "./types";
import { LOADING_EVENT } from "./loading_events";

const useHandleLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoading = useCallback((event: CustomEvent) => {
    if (!event.detail) {
      return;
    }

    const currentIsLoading = event.detail.isLoading;

    setIsLoading(currentIsLoading);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    window.addEventListener(LOADING_EVENT, handleLoading as TEventFunction, {
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [handleLoading]);

  return isLoading;
};

export default useHandleLoading;
