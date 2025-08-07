const COLORS = ["#ffffff", "#cccccc", "#111111", "#a11b22"];

export const getBorderColor = (level: number) => {
  return COLORS?.[level] || COLORS[0];
};
