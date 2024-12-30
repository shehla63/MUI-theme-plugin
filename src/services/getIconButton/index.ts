import { generateBoxShadowCSS, rgbToHex } from "../../utils";

interface IconButtonVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface IconButtonConfig {
  MuiIconButton: {
    styleOverrides: IconButtonVariantConfig;
  };
}

export default function getIconButton() {
  console.log("Fetching IconButtons...");

  const iconButtonsConfig: IconButtonConfig = {
    MuiIconButton: {
      styleOverrides: {},
    },
  };

  const buttonPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Button"
  );

  if (!buttonPage) {
    return {};
  }

  const iconButtonComponents = buttonPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<IconButton>"
  ) as ComponentSetNode[];

  iconButtonComponents.forEach((iconButtonComponentSet) => {
    if (iconButtonComponentSet.type === "COMPONENT_SET") {
      iconButtonComponentSet.children.forEach((iconButtonVariant) => {
        if (iconButtonVariant.type === "COMPONENT") {
          const variantProps = iconButtonVariant.variantProperties;

          if (
            variantProps &&
            "Size" in variantProps &&
            "Color" in variantProps &&
            "State" in variantProps
          ) {
            const { Size, Color, State } = variantProps;
            const { opacity, fills, effects, cornerRadius } = iconButtonVariant;

            let background = "",
              boxShadow = "",
              focusRippleFill = "";

            if (Array.isArray(fills) && fills.length > 0) {
              background = rgbToHex({
                ...fills[0].color,
                a: fills[0].opacity,
              });
            }

            if (Array.isArray(effects) && effects.length > 0) {
              boxShadow = generateBoxShadowCSS(effects);
            }

            // Extract focusRipple fill
            const focusRippleNode = iconButtonVariant.findChild(
              (child) =>
                child.name === "focusRipple" && child.type === "RECTANGLE"
            );

            if (focusRippleNode && "fills" in focusRippleNode) {
              if (
                Array.isArray(focusRippleNode.fills) &&
                focusRippleNode.fills.length > 0
              ) {
                focusRippleFill = rgbToHex({
                  ...focusRippleNode.fills[0].color,
                  a: focusRippleNode.fills[0].opacity,
                });
              }
            }

            // Common styles for IconButton
            const baseCss = {
              ...(background ? { background } : {}),
              ...(boxShadow ? { boxShadow } : {}),
              ...(opacity ? { opacity } : {}),
              ...(cornerRadius
                ? { borderRadius: `${String(cornerRadius)}px` }
                : {}),
            };

            // Construct the variant key dynamically
            const variantKey = `${Color}`;
            if (
              !iconButtonsConfig.MuiIconButton.styleOverrides[
                `color${variantKey}`
              ]
            ) {
              iconButtonsConfig.MuiIconButton.styleOverrides[
                `color${variantKey}`
              ] = {};
            }

            // Create or update the size key object
            const sizeKey = `&.MuiIconButton-size${Size}`;
            if (
              !iconButtonsConfig.MuiIconButton.styleOverrides[
                `color${variantKey}`
              ][sizeKey]
            ) {
              iconButtonsConfig.MuiIconButton.styleOverrides[
                `color${variantKey}`
              ][sizeKey] = {
                "&:not(.Mui-disabled):not(.Mui-focusVisible):not(:hover)": {
                  ...baseCss,
                },
                "&:not(.Mui-disabled):not(.Mui-focusVisible):hover": {},
                "&.Mui-disabled": {},
                "&:focus": {},
                "&:active": {},
              };
            }

            // State-specific CSS
            const stateKey = State.toLowerCase();
            const sizeStateObject =
              iconButtonsConfig.MuiIconButton.styleOverrides[
                `color${variantKey}`
              ][sizeKey];

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
                "& .MuiTouchRipple-root": {
                  color: focusRippleFill,
                  backgroundColor: focusRippleFill,
                },
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

  return iconButtonsConfig;
}
