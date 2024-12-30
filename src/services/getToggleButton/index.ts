import { styles } from "../../utils";

interface ButtonVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface ButtonConfig {
  MuiToggleButton: {
    styleOverrides: ButtonVariantConfig;
  };
}

export default function getToggleButton() {
  console.log("Fetching Toggle Buttons...");

  const buttonsConfig: ButtonConfig = {
    MuiToggleButton: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const toggleButtonPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Toggle Button"
  );

  if (!toggleButtonPage) {
    return {};
  }

  const toggleButtonComponents = toggleButtonPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<ToggleButton>"
  ) as ComponentSetNode[];

  toggleButtonComponents.forEach((toggleButtonComponentSet) => {
    toggleButtonComponentSet.children.forEach((toggleButtonVariant) => {
      if (toggleButtonVariant.type === "COMPONENT") {
        const variantProps = toggleButtonVariant.variantProperties;

        if (
          variantProps &&
          "Size" in variantProps &&
          "Selected" in variantProps &&
          "State" in variantProps
        ) {
          const { Size, Selected, State } = variantProps;

          let mainNodeBackground = {};
          let rippleColor = {};

          // Get background from the main node
          if (Selected === "True") {
            const selectedNode = toggleButtonVariant.children.find(
              (child) => child.name === "selected"
            );
            if (selectedNode) {
              mainNodeBackground = styles.getColorOrBackgroundCss(
                selectedNode,
                "background"
              );
            }
          } else {
            mainNodeBackground = styles.getColorOrBackgroundCss(
              toggleButtonVariant,
              "background"
            );
          }

          // Get ripple color from the focusRipple node
          const focusRippleNode = toggleButtonVariant.children.find(
            (child) => child.name === "focusRipple"
          );
          if (focusRippleNode) {
            rippleColor = styles.getColorOrBackgroundCss(
              focusRippleNode,
              "color"
            );
          }

          // Base styles
          const baseCss = {
            ...mainNodeBackground,
            ...styles.getPaddingCss(toggleButtonVariant),
            ...styles.getBordersCss(toggleButtonVariant),
            ...styles.getBorderRadiusCss(toggleButtonVariant),
            ...styles.getOpacityCss(toggleButtonVariant),
            ...styles.getBoxShadowCSS(toggleButtonVariant),
          };

          // Build keys dynamically
          const selectedKey =
            Selected === "True" ? "&.Mui-selected" : "&:not(&.Mui-selected)";
          const sizeKey = `&.MuiToggleButton-size${Size}`;

          // Ensure the structure for selected and size exists
          if (!buttonsConfig.MuiToggleButton.styleOverrides.root[selectedKey]) {
            buttonsConfig.MuiToggleButton.styleOverrides.root[selectedKey] = {};
          }
          if (
            !buttonsConfig.MuiToggleButton.styleOverrides.root[selectedKey][
              sizeKey
            ]
          ) {
            buttonsConfig.MuiToggleButton.styleOverrides.root[selectedKey][
              sizeKey
            ] = {
              "&:hover": {},
              "&:focus": {},
              "&.Mui-disabled": {},
              "&:active": {},
            };
          }

          // Assign state-specific styles
          const stateKey = State.toLowerCase();
          const sizeStateObject =
            buttonsConfig.MuiToggleButton.styleOverrides.root[selectedKey][
              sizeKey
            ];

          if (stateKey === "enabled") {
            // Default styles for enabled state
            Object.assign(sizeStateObject, baseCss);
          } else if (stateKey === "disabled") {
            sizeStateObject["&.Mui-disabled"] = {
              ...baseCss,
            };
          } else if (stateKey === "hovered") {
            sizeStateObject["&:hover"] = {
              ...baseCss,
            };
          } else if (stateKey === "focused") {
            sizeStateObject["&:focus"] = {
              ...baseCss,
              ".MuiTouchRipple-root": rippleColor,
            };
          } else if (stateKey === "pressed") {
            sizeStateObject["&:active"] = {
              ...baseCss,
            };
          }
        }
      }
    });
  });

  return buttonsConfig;
}
