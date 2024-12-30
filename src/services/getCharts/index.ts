import { getChartsXAxis, getChartsYAxis } from "./axis";
import { getChartsLegend } from "./legend";
export default function getCharts() {
  console.log("Fetching Charts...");

  const horizontalLegend = getChartsLegend("Horizontal");
  const verticalLegend = getChartsLegend("Vertical");

  return {
    MuiChartsAxis: {
      styleOverrides: {
        root: {
          ...getChartsXAxis(),
          ...getChartsYAxis(),
        },
      },
    },
    MuiChartsLegend: {
      styleOverrides: {
        root: {
          "&.MuiChartsLegend-row": {
            ...getChartsLegend("Horizontal"),
          },
          "&.MuiChartsLegend-column": {
            ...getChartsLegend("Vertical"),
          },
        },
      },
    },
  };
}
