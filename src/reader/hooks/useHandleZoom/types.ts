import type { ZOOM_TYPES } from "./zoom_utils";

export type TZoomType = (typeof ZOOM_TYPES)[keyof typeof ZOOM_TYPES];
