import type {
  TChapterData,
  TNavigationItem,
  TPageData,
  TReadingOrder,
} from "@reader/types";
import type { Entry } from "@zip.js/zip.js";
import { v4 as uuidV4 } from "uuid";

const cleanFileName = (value: string | null | undefined): string => {
  if (!value) {
    return "";
  }

  let cleanedValue = "";

  const valueList = value.split("/");

  for (const valueName of valueList) {
    if (valueName.includes(".xhtml")) {
      cleanedValue = valueName;
      break;
    }
  }

  cleanedValue = (cleanedValue?.replace(".xhtml", "") || "").toLowerCase();

  return cleanedValue;
};

const flattenNavigation = (
  navigation: TNavigationItem[],
): TNavigationItem[] => {
  const newNavigation: TNavigationItem[] = [];

  for (const item of navigation) {
    newNavigation.push(item);

    newNavigation.push(...flattenNavigation(item.children));
  }

  return newNavigation;
};

export const buildChaptersData = (
  navigation: TNavigationItem[],
  readingOrder: TReadingOrder[],
  xhtmlMap: Record<string, Entry>,
): TChapterData[] => {
  const chaptersData: TChapterData[] = [];
  const flatNavigation = flattenNavigation(navigation);
  const cleanedReadingOrder = readingOrder.map((value) =>
    cleanFileName(value.src),
  );

  let chapterIndex = 0;

  for (let index = 0; index < flatNavigation.length; index++) {
    const navigationItem = flatNavigation?.[index];
    const nextNavigationItem = flatNavigation?.[index + 1];

    if (!navigationItem) {
      continue;
    }

    const chapterName = navigationItem.label || "";
    const pages: TPageData[] = [];
    let pageIndex = 0;
    const chapterStart = cleanFileName(navigationItem?.src) || "";
    const nextChapterStart = cleanFileName(nextNavigationItem?.src) || "";

    const readingOrderStart = cleanedReadingOrder.indexOf(chapterStart);
    let readingOrderEnd = cleanedReadingOrder.indexOf(nextChapterStart);

    if (readingOrderStart < 0) {
      console.error("can't find start chapter");
      continue;
    }

    if (!nextNavigationItem) {
      readingOrderEnd = cleanedReadingOrder.length;
    }

    for (
      let readingIndex = readingOrderStart;
      readingIndex < readingOrderEnd;
      readingIndex++
    ) {
      const src = readingOrder[readingIndex].src;
      const filePath = `OEBPS/${src}`;

      const pageData: TPageData = {
        xhtmlName: src,
        xhtmlEntry: xhtmlMap[filePath],
        pageNumber: pageIndex,
      };

      pages.push(pageData);

      pageIndex += 1;
    }

    const data: TChapterData = {
      id: uuidV4(),
      name: chapterName,
      pages,
      currentPage: 0,
      chapterIndex,
    };

    chaptersData.push(data);
    chapterIndex += 1;
  }

  return chaptersData;
};
