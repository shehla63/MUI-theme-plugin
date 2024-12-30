import getPalette from "../getPalette";
import getPaletteModes from "../getPaletteModes";
import getShadows from "../getShadows";

export default function getAllModesColorSchemes() {
  console.log("Fetching All Modes Color Schemes...");

  let allModesColorSchemes = {};
  const modes = getPaletteModes();
  modes.forEach((mode) => {
    allModesColorSchemes = {
      ...allModesColorSchemes,
      [mode.name.toLowerCase()]: {
        palette: getPalette(mode.modeId).palette,
        // componentColors: palette.components as Record<string, unknown>,
        shadows: getShadows(mode.modeId),
      },
    };
  });

  return allModesColorSchemes;
}
