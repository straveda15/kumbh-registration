// Validated via the dataviz skill's scripts/validate_palette.js (categorical,
// light & dark, adjacent + all-pairs checks) — do not hand-pick replacements
// without re-running it. Magenta (gender "other") sits below 3:1 contrast on
// the light surface by design; charts using it must keep visible direct
// labels/legend (the "relief rule"), never rely on the color alone.
export const CHART_COLORS = {
  light: {
    blue: '#2563EB',
    green: '#008300',
    magenta: '#e87ba4',
    red: '#e34948',
    grid: '#e1e0d9',
    axis: '#c3c2b7',
    mutedText: '#898781',
  },
  dark: {
    blue: '#3987e5',
    green: '#008300',
    magenta: '#d55181',
    red: '#e66767',
    grid: '#2c2c2a',
    axis: '#383835',
    mutedText: '#898781',
  },
};

export const getChartColors = (resolvedTheme) =>
  CHART_COLORS[resolvedTheme === 'light' ? 'light' : 'dark'];

export default getChartColors;
