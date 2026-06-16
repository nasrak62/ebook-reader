import type { Entry } from "@zip.js/zip.js";

export type TEntryIndex = {
  byLowerPath: Record<string, Entry>;
  byBasename: Record<string, Entry>;
};

/**
 * Build lookup indexes for a zip entry map so paths can be resolved
 * case-insensitively and by suffix/basename. EPUBs vary wildly in folder
 * layout (OEBPS/, EPUB/, OPS/, root, ...), so a single hardcoded prefix
 * is never enough.
 */
export const buildEntryIndex = (map: Record<string, Entry>): TEntryIndex => {
  const byLowerPath: Record<string, Entry> = {};
  const byBasename: Record<string, Entry> = {};

  for (const key of Object.keys(map)) {
    const lower = key.toLowerCase();
    byLowerPath[lower] = map[key];

    const base = lower.split("/").pop() || lower;

    if (!(base in byBasename)) {
      byBasename[base] = map[key];
    }
  }

  return { byLowerPath, byBasename };
};

/** Normalize a manifest/href/src into a comparable lowercase relative path. */
export const normalizeSrc = (src: string): string => {
  let value = src;

  try {
    value = decodeURIComponent(value);
  } catch {
    // keep raw value if it isn't valid percent-encoding
  }

  value = value.split("#")[0].split("?")[0];
  value = value.replace(/^(\.\.\/|\.\/|\/)+/, "");

  return value.toLowerCase();
};

/** Resolve a src against an entry index, trying progressively looser matches. */
export const resolveEntry = (
  index: TEntryIndex,
  src: string | null | undefined,
): Entry | null => {
  if (!src) {
    return null;
  }

  const norm = normalizeSrc(src);

  if (index.byLowerPath[norm]) {
    return index.byLowerPath[norm];
  }

  if (index.byLowerPath[`oebps/${norm}`]) {
    return index.byLowerPath[`oebps/${norm}`];
  }

  for (const path of Object.keys(index.byLowerPath)) {
    if (path === norm || path.endsWith(`/${norm}`)) {
      return index.byLowerPath[path];
    }
  }

  const base = norm.split("/").pop() || norm;

  return index.byBasename[base] || null;
};
