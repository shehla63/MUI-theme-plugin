import { styles } from "../../utils";

interface ButtonVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface ButtonConfig {
  MuiButton: {
    styleOverrides: ButtonVariantConfig;
  };
}

export default function getButtons() {
  console.log("Fetching Buttons...");

  const buttonsConfig: ButtonConfig = {
    MuiButton: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const buttonPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Button"
  );

  if (!buttonPage) {
    return {};
  }

  const buttonComponents = buttonPage.findAll((node) => {
    return node.name.includes("<Button>");
  });

  buttonComponents.forEach((buttonComponentSet) => {
    if (buttonComponentSet.type === "COMPONENT_SET") {
      buttonComponentSet.children.forEach((buttonVariant) => {
        if (buttonVariant.type === "COMPONENT") {
          const variantProps = buttonVariant.variantProperties;

          if (
            variantProps &&
            "Size" in variantProps &&
            "Color" in variantProps &&
            "State" in variantProps &&
            "Variant" in variantProps
          ) {
            const { Size, Color, State, Variant } = variantProps;

            let buttonNode = {};
            let rippleColor = {};

            const baseChild = buttonVariant.children.find(
              (child) => child.name === "Base"
            );

            if (baseChild && "children" in baseChild) {
              const buttonNodeChild = baseChild.children.find(
                (child) => child.name === "Button"
              );

              if (buttonNodeChild) {
                buttonNode = buttonNodeChild;
              }
            }

            const focusRippleChild = buttonVariant.children.find(
              (child) => child.name === "focusRipple"
            );

            if (focusRippleChild && "children" in focusRippleChild) {
              const innerFocusRippleChild = focusRippleChild.children.find(
                (child) => child.name === "focusRipple"
              );

              if (innerFocusRippleChild) {
                rippleColor = styles.getColorOrBackgroundCss(
                  innerFocusRippleChild,
                  "color"
                );
              }
            }

            let background = styles.getColorOrBackgroundCss(
              buttonVariant,
              "background"
            );
            let padding = styles.getPaddingCss(buttonVariant);
            let borderRadius = styles.getBorderRadiusCss(buttonVariant);
            let boxShadow = styles.getBoxShadowCSS(buttonVariant);
            let border = styles.getBordersCss(buttonVariant);
            let opacity = styles.getOpacityCss(buttonVariant);
            let color = styles.getColorOrBackgroundCss(buttonNode, "color");

            // Common styles object, applied as a base
            const baseCss = {
              ...background,
              ...padding,
              ...boxShadow,
              ...border,
              ...opacity,
              ...color,
            };

            // Construct the variant key dynamically
            const variantKey = `&.MuiButton-${Variant.toLowerCase()}${Color}`;
            if (!buttonsConfig.MuiButton.styleOverrides.root[variantKey]) {
              buttonsConfig.MuiButton.styleOverrides.root[variantKey] = {};
            }

            // Create or update the size key object
            const sizeKey = `&.MuiButton-size${Size}`;
            const groupClass = "&:not(&.MuiButtonGroup-grouped)";

            if (
              !buttonsConfig.MuiButton.styleOverrides.root[variantKey][sizeKey]
            ) {
              buttonsConfig.MuiButton.styleOverrides.root[variantKey][sizeKey] =
                {
                  ...baseCss,
                  [groupClass]: {
                    ...borderRadius,
                  },
                  "&:hover": {},
                  "&.Mui-disabled": {},
                  "&:focus": {},
                  "&:active": {},
                };
            }

            // State-specific CSS
            const stateKey = State.toLowerCase();
            const sizeStateObject =
              buttonsConfig.MuiButton.styleOverrides.root[variantKey][sizeKey];
            if (stateKey === "disabled") {
              sizeStateObject["&.Mui-disabled"] = {
                ...baseCss,
              };
              sizeStateObject["&.Mui-disabled"][groupClass] = {
                ...borderRadius,
              };
            } else if (stateKey === "hovered") {
              sizeStateObject["&:hover"] = {
                ...baseCss,
              };
              sizeStateObject["&:hover"][groupClass] = {
                ...borderRadius,
              };
            } else if (stateKey === "focused") {
              sizeStateObject["&:focus"] = {
                ...baseCss,
              };
              sizeStateObject["&:focus"][groupClass] = {
                ...borderRadius,
              };
              sizeStateObject["&:focus"][".MuiTouchRipple-root"] = {
                ...rippleColor,
              };
            } else if (stateKey === "pressed") {
              sizeStateObject["&:active"] = {
                ...baseCss,
              };
              sizeStateObject["&:active"][groupClass] = {
                ...borderRadius,
              };
            }
          }
        }
      });
    }
  });

  return buttonsConfig;
}
