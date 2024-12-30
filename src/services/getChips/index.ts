import { generateBoxShadowCSS, rgbToHex } from "../../utils";

interface ChipVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface ChipConfig {
  MuiChip: {
    styleOverrides: ChipVariantConfig;
  };
}

export default function getChips() {
  console.log("Fetching Chips...");

  const chipsConfig: ChipConfig = {
    MuiChip: {
      styleOverrides: {},
    },
  };

  const chipPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Chip"
  );

  if (!chipPage) {
    return {};
  }

  const chipComponents = chipPage.findAll((node) => {
    return node.name.includes("<Chip>");
  });

  chipComponents.forEach((chipComponentSet) => {
    if (chipComponentSet.type === "COMPONENT_SET") {
      chipComponentSet.children.forEach((chipVariant) => {
        if (chipVariant.type === "COMPONENT") {
          const variantProps = chipVariant.variantProperties;

          if (
            variantProps &&
            "Size" in variantProps &&
            "Color" in variantProps &&
            "State" in variantProps &&
            "Variant" in variantProps
          ) {
            const { Size, Color, State, Variant } = variantProps;
            const { verticalPadding, horizontalPadding } = chipVariant;
            const { opacity, fills, effects, cornerRadius } = chipVariant;
            const { strokes, dashPattern } = chipVariant;

            let background = "",
              boxShadow = "",
              borderWidth = "",
              borderStyle = "",
              borderColor = "";

            if (Array.isArray(strokes) && strokes.length > 0) {
              borderColor = rgbToHex({
                ...strokes[0].color,
                a: strokes[0].opacity,
              });
            }

            if (dashPattern.length > 0) {
              borderStyle = "dashed";
            } else {
              borderStyle = "solid";
            }

            if (Array.isArray(fills) && fills.length > 0) {
              background = rgbToHex({
                ...fills[0].color,
                a: fills[0].opacity,
              });
            }

            if (Array.isArray(effects) && effects.length > 0) {
              boxShadow = generateBoxShadowCSS(effects);
            }

            const baseCss = {
              ...(verticalPadding || horizontalPadding
                ? { padding: `${verticalPadding}px ${horizontalPadding}px` }
                : {}),
              ...(background ? { background } : {}),
              ...(boxShadow ? { boxShadow } : {}),
              ...(opacity ? { opacity } : {}),
              ...(cornerRadius
                ? { borderRadius: `${String(cornerRadius)}px` }
                : {}),
              ...(borderWidth ? { borderWidth } : {}),
              ...(borderStyle ? { borderStyle } : {}),
              ...(borderColor ? { borderColor } : {}),
            };

            const variantKey = `${Variant.toLowerCase()}${Color}`;
            if (!chipsConfig.MuiChip.styleOverrides[variantKey]) {
              chipsConfig.MuiChip.styleOverrides[variantKey] = {};
            }

            const sizeKey = `&.MuiChip-size${Size}`;
            if (!chipsConfig.MuiChip.styleOverrides[variantKey][sizeKey]) {
              chipsConfig.MuiChip.styleOverrides[variantKey][sizeKey] = {
                "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
                  "&.MuiTouchRipple-root": baseCss,
                  ...baseCss,
                },
                "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {},
                "&.Mui-disabled": {},
                "&:focus": {},
                "&:active": {},
              };
            }

            const stateKey = State.toLowerCase();
            const sizeStateObject =
              chipsConfig.MuiChip.styleOverrides[variantKey][sizeKey];
            if (stateKey === "disabled") {
              sizeStateObject["&.Mui-disabled"] = {
                ...baseCss,
              };
            } else if (stateKey === "hovered") {
              sizeStateObject[
                "&:not(.Mui-disabled):not(.Mui-focusVisible):hover"
              ] = {
                ...baseCss,
              };
            } else if (stateKey === "focused") {
              sizeStateObject["&:focus"] = {
                ...baseCss,
              };
            } else if (stateKey === "pressed") {
              sizeStateObject["&:active"] = {
                ...baseCss,
              };
            }
          }
        }
      });
    }
  });

  return chipsConfig;
}
