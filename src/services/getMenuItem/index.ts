import { styles } from "../../utils";

export default function getMenuItem() {
  const menuPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Menu"
  );

  if (!menuPage) {
    console.log("Menu page not found.");
    return {};
  }

  const menuConfig: Record<string, any> = {
    sm: {
      // Small Screen = "True"
      ":not(&.MuiMenuItem-gutters)": {
        "&.MuiMenuItem-dense": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
        ":not(&.MuiMenuItem-dense)": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
      },
      "&.MuiMenuItem-gutters": {
        "&.MuiMenuItem-dense": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
        ":not(&.MuiMenuItem-dense)": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
      },
    },
    md: {
      // Small Screen = "False"
      ":not(&.MuiMenuItem-gutters)": {
        "&.MuiMenuItem-dense": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
        ":not(&.MuiMenuItem-dense)": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
      },
      "&.MuiMenuItem-gutters": {
        "&.MuiMenuItem-dense": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
        ":not(&.MuiMenuItem-dense)": {
          "&:hover": {},
          "&.Mui-disabled": {},
          "&.Mui-selected": {},
        },
      },
    },
  };

  const allMenuComponents = menuPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<MenuItem>"
  ) as ComponentSetNode[];

  allMenuComponents.forEach((menuComponentSet) => {
    if (menuComponentSet.type === "COMPONENT_SET") {
      menuComponentSet.children.forEach((menuVariant) => {
        if (menuVariant.type === "COMPONENT") {
          const variantProps = menuVariant.variantProperties;

          if (
            variantProps &&
            "Dense" in variantProps &&
            "Dis. Gutters" in variantProps &&
            "Small Screen" in variantProps
          ) {
            const {
              Dense,
              "Dis. Gutters": DisGutters,
              "Small Screen": SmallScreen,
            } = variantProps;
            const screenSizeKey = SmallScreen === "True" ? "sm" : "md";
            const denseSelector =
              Dense === "True"
                ? "&.MuiMenuItem-dense"
                : ":not(&.MuiMenuItem-dense)";
            const guttersSelector =
              DisGutters === "True"
                ? "&.MuiMenuItem-gutters"
                : ":not(&.MuiMenuItem-gutters)";

            // Extract CSS properties based on variant state and apply to the appropriate config
            const baseStyles = getBaseStyles(menuVariant); // Hypothetical function to extract base styles
            const targetConfig =
              menuConfig[screenSizeKey][guttersSelector][denseSelector];

            // Apply the base styles based on the state
            switch (variantProps.State) {
              case "Enabled":
                Object.assign(targetConfig, baseStyles);
                break;
              case "Hovered":
                Object.assign(targetConfig["&:hover"], baseStyles);
                break;
              case "Disabled":
                Object.assign(targetConfig["&.Mui-disabled"], baseStyles);
                break;
              case "Selected":
                Object.assign(targetConfig["&.Mui-selected"], baseStyles);
                break;
            }
          }
        }
      });
    }
  });

  // Wrap menuConfig in the specified structure
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: menuConfig,
      },
    },
  };
}

// Hypothetical helper function to extract base styles
function getBaseStyles(element: any) {
  const background = styles.getColorOrBackgroundCss(element, "background");

  const outerContainerNode = element.children.find(
    (node: any) => node.name === "Container"
  );
  const padding = outerContainerNode
    ? styles.getPaddingCss(outerContainerNode)
    : {};
  const borderRadius = outerContainerNode
    ? styles.getBorderRadiusCss(outerContainerNode)
    : {};

  const innerContainerNode = outerContainerNode?.children.find(
    (node: any) => node.name === "Container"
  );

  const valueNode = innerContainerNode?.children.find(
    (node: any) => node.name === "Value"
  );

  const color = valueNode
    ? styles.getColorOrBackgroundCss(valueNode, "color")
    : {};
  const fontWeight = valueNode ? styles.getFontWeightCss(valueNode) : {};
  const fontFamily = valueNode ? styles.getFontFamilyCss(valueNode) : {};
  const letterSpacing = valueNode ? styles.getLetterSpacingCss(valueNode) : {};

  return {
    ...background,
    ...padding,
    ...borderRadius,
    ...color,
    ...fontWeight,
    ...fontFamily,
    ...letterSpacing,
  };
}
