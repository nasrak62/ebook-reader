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
import ChapterManager from "@reader/services/chapter_manager";
import { handleGetPageData } from "./handle_page_data";

const BookContent = ({
  dataMap,
  selectedChapterData,
  setSelectedChapterData,
}: TBookContentProps) => {
  const chapterManagerRef = useRef(new ChapterManager());
  console.log({ selectedChapterData });

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

  return (
    <div className={classes.container}>
      {isLoading && <Loader />}
      <div className={classes.titleContainer}>
        <button
          className={classes.pageButton}
          type="button"
          onClick={handlePrevPage}
          disabled={prevPageButtonDisabled}
        >
          <img src={prevPageIcon} alt="prev page" />
        </button>
        <h1 className={classes.title}>
          {chapterName}-{currentPageNumber + 1}/
          {effectiveSelectedChapter?.pages.length || 0}
        </h1>

        <button
          className={classes.pageButton}
          type="button"
          disabled={nextPageButtonDisabled}
          onClick={handleNextPage}
        >
          <img src={nextPageIcon} alt="next page" />
        </button>

        <button
          className={classes.pageButton}
          type="button"
          onClick={handleZoomIn}
        >
          <img src={zoomInIcon} alt="zoomIn" />
        </button>

        <button
          className={classes.pageButton}
          type="button"
          onClick={handleZoomOut}
        >
          <img src={zoomOutIcon} alt="zoom out" />
        </button>

        <div>
          <select
            className={classes.select}
            value={zoomType}
            onChange={handleZoomType}
          >
            <option value="all">Zoom all</option>
            <option value="images">Zoom only images</option>
          </select>
        </div>
      </div>
      <div className={classes.content} ref={viewRef} />
    </div>
  );
};

export default BookContent;
