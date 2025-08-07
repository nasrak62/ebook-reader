import DOMPurify from "dompurify";

export const cleanHTML = (value: string) => {
  const cleanValue = DOMPurify.sanitize(value, {
    USE_PROFILES: {
      html: true,
      svg: true,
      mathMl: true,
    },
  });

  return cleanValue;
};
