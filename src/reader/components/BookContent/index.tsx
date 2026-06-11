import { useCallback, useEffect, useRef } from "react";
import classes from "./style.module.css";
import type { TBookContentProps } from "./types";
import Loader from "../Loader";
import prevPageIcon from "./prev_icon.svg";
import nextPageIcon from "./next_icon.svg";
import zoomInIcon from "./zoom_in_icon.svg";
import zoomOutIcon from "./zoom_out_icon.svg";
import useHandleLoading from "@reader/hooks/useHandleLoading";
import useHandlePageNavigation from "@reader/hooks/useHandlePageNavigation";
import useHandleZoom from "@reader/hooks/useHandleZoom";
import useReaderTheme from "@reader/hooks/useReaderTheme";
import ChapterManager from "@reader/services/chapter_manager";
import { handleGetPageData } from "./handle_page_data";

const BookContent = ({
  dataMap,
  selectedChapterData,
  setSelectedChapterData,
}: TBookContentProps) => {
  const chapterManagerRef = useRef(new ChapterManager());

  const {
    handleNextPage,
    handlePrevPage,
    nextPageButtonDisabled,
    prevPageButtonDisabled,
    effectiveSelectedChapter,
    currentPageNumber,
    chapterName,
  } = useHandlePageNavigation({
    dataMap,
    selectedChapterData,
    setSelectedChapterData,
  });

  const isLoading = useHandleLoading();
  const viewRef = useRef<HTMLDivElement | null>(null);

  const { handleZoomType, handleZoomIn, handleZoomOut, zoomType } =
    useHandleZoom(viewRef.current);

  const { readerTheme, handleThemeChange } = useReaderTheme();

  const handleGetPageDataWrapper = useCallback(async () => {
    handleGetPageData(
      chapterManagerRef?.current,
      viewRef?.current,
      dataMap,
      selectedChapterData,
      currentPageNumber,
    );
  }, [dataMap, currentPageNumber, selectedChapterData]);

  useEffect(() => {
    handleGetPageDataWrapper();
  }, [handleGetPageDataWrapper]);

  useEffect(() => {
    const manager = chapterManagerRef.current;

    return () => {
      manager.revokeAll();
    };
  }, []);

  return (
    <div className={classes.container}>
      {isLoading && <Loader />}
      <div className={classes.toolbar}>
        <button
          className={classes.iconButton}
          type="button"
          onClick={handlePrevPage}
          disabled={prevPageButtonDisabled}
          aria-label="Previous page"
        >
          <img src={prevPageIcon} alt="prev page" />
        </button>

        <button
          className={classes.iconButton}
          type="button"
          disabled={nextPageButtonDisabled}
          onClick={handleNextPage}
          aria-label="Next page"
        >
          <img src={nextPageIcon} alt="next page" />
        </button>

        <h1 className={classes.title}>
          {chapterName} — {currentPageNumber + 1}/
          {effectiveSelectedChapter?.pages.length || 0}
        </h1>

        <button
          className={classes.iconButton}
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <img src={zoomInIcon} alt="zoom in" />
        </button>

        <button
          className={classes.iconButton}
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <img src={zoomOutIcon} alt="zoom out" />
        </button>

        <select
          className={classes.select}
          value={zoomType}
          onChange={handleZoomType}
          aria-label="Zoom target"
        >
          <option value="all">Zoom all</option>
          <option value="images">Zoom images</option>
        </select>

        <span className={classes.spacer} />

        <select
          className={classes.select}
          value={readerTheme}
          onChange={handleThemeChange}
          aria-label="Reading theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="sepia">Sepia</option>
        </select>
      </div>

      <div className={classes.contentScroll}>
        <div className={classes.content} ref={viewRef} />
      </div>
    </div>
  );
};

export default BookContent;
