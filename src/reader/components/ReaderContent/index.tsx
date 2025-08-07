import BookContent from "../BookContent";
import BookUpload from "../BookUpload";
import classes from "./style.module.css";
import type { TReaderContentProps } from "./types";

const ReaderContent = ({
  dataMap,
  setDataMap,
  selectedChapterData,
  setSelectedChapterData,
}: TReaderContentProps) => {
  return (
    <div className={classes.container}>
      {dataMap && (
        <BookContent
          dataMap={dataMap}
          setSelectedChapterData={setSelectedChapterData}
          selectedChapterData={selectedChapterData}
        />
      )}
      {!dataMap && (
        <BookUpload
          dataMap={dataMap}
          setDataMap={setDataMap}
          setSelectedChapterData={setSelectedChapterData}
        />
      )}
    </div>
  );
};

export default ReaderContent;
