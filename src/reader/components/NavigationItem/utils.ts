const COLORS = ["#6366f1", "#8b8fa3", "#5b566e", "#c0566b"];

export const getBorderColor = (level: number) => {
  return COLORS?.[level] || COLORS[COLORS.length - 1];
};

export const getIndent = (level: number) => {
  return 12 + level * 14;
};
