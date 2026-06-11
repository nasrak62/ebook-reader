import { useCallback, useEffect, useState } from "react";
import {
  READER_THEME_STORAGE_KEY,
  READER_THEMES,
  type TReaderTheme,
} from "./types";

const isReaderTheme = (value: string | null): value is TReaderTheme => {
  return value !== null && READER_THEMES.includes(value as TReaderTheme);
};

const getInitialTheme = (): TReaderTheme => {
  const stored = localStorage.getItem(READER_THEME_STORAGE_KEY);

  return isReaderTheme(stored) ? stored : "light";
};

const useReaderTheme = () => {
  const [readerTheme, setReaderTheme] = useState<TReaderTheme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-reader-theme", readerTheme);
    localStorage.setItem(READER_THEME_STORAGE_KEY, readerTheme);
  }, [readerTheme]);

  const handleThemeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;

      if (isReaderTheme(value)) {
        setReaderTheme(value);
      }
    },
    [],
  );

  return { readerTheme, setReaderTheme, handleThemeChange };
};

export default useReaderTheme;
