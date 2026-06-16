import { buildZipMappers } from "./zip_mapper";
import { parseOpf } from "./opf_data";
import { parseToc } from "./toc_data";
import type { TBookUploadProps } from "./types";
import classes from "./style.module.css";
import { buildChaptersData } from "./build_chapter_data";

const BookUpload = ({
  dataMap,
  setDataMap,
  setSelectedChapterData,
}: TBookUploadProps) => {
  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileHandler = e.target.files?.[0];

    if (!fileHandler) {
      return;
    }

    const { imagesMap, xhtmlMap, tocFile, opfFile } =
      await buildZipMappers(fileHandler);

    const { manifestItems, readingOrder } = await parseOpf(opfFile);
    const { navigation, title } = await parseToc(tocFile);
    const chaptersData = buildChaptersData(navigation, readingOrder, xhtmlMap);

    setSelectedChapterData(chaptersData?.[0] || null);

    const id = `${title}-${chaptersData.length}-${readingOrder.length}`;

    setDataMap({
      imagesMap,
      xhtmlMap,
      manifestItems,
      readingOrder,
      fileHandler,
      navigation,
      title,
      chaptersData,
      id,
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.heading}>EPUB & Manga Reader</h2>
        <p className={classes.subtitle}>
          Choose an <code>.epub</code> file to start reading.
        </p>
        <input
          id="epub-file"
          className={classes.fileInput}
          type="file"
          accept=".epub"
          onChange={handleFilePick}
        />
        <label className={classes.fileLabel} htmlFor="epub-file">
          📁 Choose EPUB file
        </label>
        {dataMap?.fileHandler && (
          <p className={classes.selected}>
            Selected: {dataMap?.fileHandler?.name}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookUpload;
