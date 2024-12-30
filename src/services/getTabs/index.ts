import { styles } from "../../utils";

export default function getTabs() {
  console.log("Fetching Tabs...");

  const tabsPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Tabs"
  );

  if (!tabsPage) {
    console.log("Tabs page not found.");
    return {};
  }

  const tabsConfig: Record<string, any> = {
    "&.MuiTabs-vertical": {
      "& .MuiButtonBase-root": {
        "&.Mui-selected": {},
        ":not(&.Mui-selected)": {},
      },
    },
    ":not(&.MuiTabs-vertical)": {
      "& .MuiButtonBase-root": {
        "&.Mui-selected": {},
        ":not(&.Mui-selected)": {},
      },
    },
  };

  const allTabsComponents = tabsPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Tab>"
  ) as ComponentSetNode[];

  allTabsComponents.forEach((tabsComponentSet) => {
    if (tabsComponentSet.type === "COMPONENT_SET") {
      tabsComponentSet.children.forEach((tabVariant) => {
        if (tabVariant.type === "COMPONENT") {
          const variantProps = tabVariant.variantProperties;

          if (
            variantProps &&
            "Active" in variantProps &&
            "Active Color" in variantProps &&
            "Orientation" in variantProps &&
            "State" in variantProps
          ) {
            const {
              Active,
              "Active Color": activeColor,
              Orientation,
              State,
            } = variantProps;

            const isSelected = Active === "True";
            const orientationKey =
              Orientation === "Vertical"
                ? "&.MuiTabs-vertical"
                : ":not(&.MuiTabs-vertical)";
            const selectedKey = isSelected
              ? "&.Mui-selected"
              : ":not(&.Mui-selected)";
            const colorKey = `&.MuiTab-textColor${activeColor}`;

            const containerNode = tabVariant.children.find(
              (node) => node.name === "Container"
            ) as FrameNode;

            const buttonNode = containerNode?.children.find(
              (node) => node.name === "Button"
            ) as TextNode;

            const lineNode = tabVariant.children.find(
              (node) => node.name === "Line"
            ) as RectangleNode;

            const rippleNode = tabVariant.children.find(
              (node) => node.name === "focusRipple"
            ) as RectangleNode;

            // Extract styles using utility functions
            const containerStyles = {
              ...styles.getPaddingCss(containerNode),
              ...styles.getBorderRadiusCss(containerNode),
            };

            const textStyles = {
              ...styles.getColorOrBackgroundCss(buttonNode, "color"),
              ...styles.getFontSizeCss(buttonNode),
              ...styles.getFontFamilyCss(buttonNode),
              ...styles.getLetterSpacingCss(buttonNode),
              ...styles.getFontWeightCss(buttonNode),
            };

            const borderStyles =
              Orientation === "Vertical"
                ? { borderRight: styles.getBordersCss(lineNode, true).border }
                : {
                    borderBottom: styles.getBordersCss(lineNode, true).border,
                  };

            // Extract background styles
            let backgroundStyles = {};
            if (
              rippleNode &&
              "children" in rippleNode &&
              Array.isArray(rippleNode.children) &&
              rippleNode.children.length > 0
            ) {
              const childRippleNode = rippleNode.children.find(
                (child: any) => child.name === "focusRipple"
              ) as RectangleNode;
              if (childRippleNode) {
                backgroundStyles = {
                  ...styles.getColorOrBackgroundCss(
                    childRippleNode,
                    "background"
                  ),
                };
              }
            } else if (rippleNode) {
              backgroundStyles = {
                ...styles.getColorOrBackgroundCss(rippleNode, "background"),
              };
            }

            let rippleColorStyles = {};
            if ("background" in backgroundStyles) {
              rippleColorStyles = {
                color: backgroundStyles.background,
              };
            }

            const combinedStyles = {
              ...textStyles,
              ...containerStyles,
              ...borderStyles,
              ...(State !== "Focused" && State !== "Pressed"
                ? backgroundStyles
                : {}),
            };

            // Assign styles based on State
            let stateKey: string;
            if (State === "Hovered") {
              stateKey = "&:hover";
            } else if (State === "Pressed") {
              stateKey = "&:active";
            } else if (State === "Disabled") {
              stateKey = "&.Mui-disabled";
            } else if (State === "Focused") {
              stateKey = "&:focus";
            } else {
              stateKey = ""; // Directly assign for Enabled state
            }

            // Initialize the colorKey if not present
            if (
              !tabsConfig[orientationKey]["& .MuiButtonBase-root"][selectedKey][
                colorKey
              ]
            ) {
              tabsConfig[orientationKey]["& .MuiButtonBase-root"][selectedKey][
                colorKey
              ] = {};
            }

            if (stateKey) {
              // Add to specific state (e.g., &:hover, &:active, etc.)
              tabsConfig[orientationKey]["& .MuiButtonBase-root"][selectedKey][
                colorKey
              ][stateKey] = {
                ...combinedStyles,
                ...(stateKey === "&:active" || stateKey === "&:focus"
                  ? {
                      ".MuiTouchRipple-root": {
                        ...rippleColorStyles,
                      },
                    }
                  : {}),
              };
            } else {
              // Add directly for "Enabled" state
              Object.assign(
                tabsConfig[orientationKey]["& .MuiButtonBase-root"][
                  selectedKey
                ][colorKey],
                combinedStyles
              );
            }
          }
        }
      });
    }
  });

  return {
    MuiTabs: {
      styleOverrides: {
        root: tabsConfig,
      },
    },
  };
}
