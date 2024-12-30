import { styles } from "../../utils";

interface ButtonGroupConfig {
  MuiButtonGroup: {
    styleOverrides: {
      root: {
        [key: string]: {
          [key: string]: {
            [key: string]: any;
          };
        };
      };
    };
  };
}

function extractColor(inputString: string) {
  // Correct regex to match full hex colors and RGB/RGBA colors
  const colorRegex =
    /#(?:[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(\d+(\.\d+)?|0?\.\d+))?\s*\)/;

  // Find the color in the input string
  const match = inputString.match(colorRegex);

  // Return the matched color or null if none found
  return match ? match[0] : "";
}

export default function getButtonGroups() {
  console.log("Fetching Button Groups...");

  const buttonGroupsConfig: ButtonGroupConfig = {
    MuiButtonGroup: {
      styleOverrides: {
        root: {}, // Initialize the root key
      },
    },
  };

  const buttonGroupPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Button Group"
  );

  if (!buttonGroupPage) {
    return {};
  }

  const buttonGroupComponents = buttonGroupPage.findAll((node) => {
    return node.name.includes("<ButtonGroup>");
  });

  buttonGroupComponents.forEach((buttonGroupComponentSet) => {
    if (buttonGroupComponentSet.type === "COMPONENT_SET") {
      buttonGroupComponentSet.children.forEach((buttonVariant) => {
        if (buttonVariant.type === "COMPONENT") {
          const variantProps = buttonVariant.variantProperties;

          if (
            variantProps &&
            "Color" in variantProps &&
            "Variant" in variantProps &&
            "Orientation" in variantProps
          ) {
            const { Color, Variant, Orientation } = variantProps;

            let borderRadius = {},
              boxShadow = {},
              borderColor = "",
              border = {};

            const verticalNode = buttonVariant.children.find(
              (child) => child.name === "Vertical"
            );

            boxShadow = styles.getBoxShadowCSS(buttonVariant);
            borderRadius = styles.getBorderRadiusCss(buttonVariant);
            border = styles.getBordersCss(verticalNode, true);

            if ("border" in border && typeof border.border === "string") {
              borderColor = extractColor(border.border);
            }

            // Build the hierarchical structure
            const orientationKey = `&.MuiButtonGroup-${Orientation.toLowerCase()}`;
            const variantKey = `&.MuiButtonGroup-${Variant.toLowerCase()}`;
            const colorKey = `&.MuiButtonGroup-color${Color}`;

            if (
              !buttonGroupsConfig.MuiButtonGroup.styleOverrides.root[
                orientationKey
              ]
            ) {
              buttonGroupsConfig.MuiButtonGroup.styleOverrides.root[
                orientationKey
              ] = {};
            }

            if (
              !buttonGroupsConfig.MuiButtonGroup.styleOverrides.root[
                orientationKey
              ][variantKey]
            ) {
              buttonGroupsConfig.MuiButtonGroup.styleOverrides.root[
                orientationKey
              ][variantKey] = {};
            }

            // Add specific styles for horizontal and vertical orientations
            buttonGroupsConfig.MuiButtonGroup.styleOverrides.root[
              orientationKey
            ][variantKey][colorKey] = {
              ...boxShadow,
              ".MuiButtonGroup-grouped": {
                boxShadow: "none",
                borderRadius: "0px",
                ...(Orientation === "Horizontal"
                  ? {
                      "&.MuiButtonGroup-firstButton": {
                        ...borderRadius,
                        borderTopRightRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderColor,
                      },
                      "&.MuiButtonGroup-lastButton": {
                        ...borderRadius,
                        borderTopLeftRadius: "0px",
                        borderBottomLeftRadius: "0px",
                      },
                    }
                  : {
                      // Vertical-specific styles
                      "&.MuiButtonGroup-firstButton": {
                        ...borderRadius,
                        borderBottomLeftRadius: "0px",
                        borderBottomRightRadius: "0px",
                        borderColor,
                      },
                      "&.MuiButtonGroup-lastButton": {
                        ...borderRadius,
                        borderTopLeftRadius: "0px",
                        borderTopRightRadius: "0px",
                      },
                    }),
                "&.MuiButtonGroup-middleButton": {
                  borderColor,
                },
              },
            };
          }
        }
      });
    }
  });

  return buttonGroupsConfig;
}
