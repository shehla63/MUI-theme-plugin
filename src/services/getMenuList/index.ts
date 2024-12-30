import { styles } from "../../utils";

export default function getMenuList() {
  console.log("Fetching Menu List...");
  const menuPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Menu"
  );

  if (!menuPage) {
    console.log("Menu page not found.");
    return {};
  }

  const menuListConfig: Record<string, any> = {
    sm: {
      ":not(&.MuiList-padding)": {
        "&.MuiList-dense": {},
        ":not(&.MuiList-dense)": {},
      },
      "&.MuiList-padding": {
        "&.MuiList-dense": {},
        ":not(&.MuiList-dense)": {},
      },
    },
    md: {
      ":not(&.MuiList-padding)": {
        "&.MuiList-dense": {},
        ":not(&.MuiList-dense)": {},
      },
      "&.MuiList-padding": {
        "&.MuiList-dense": {},
        ":not(&.MuiList-dense)": {},
      },
    },
  };

  const allMenuComponents = menuPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<MenuList>"
  ) as ComponentSetNode[];

  allMenuComponents.forEach((menuComponentSet) => {
    if (menuComponentSet.type === "COMPONENT_SET") {
      menuComponentSet.children.forEach((menuVariant) => {
        if (menuVariant.type === "COMPONENT") {
          const variantProps = menuVariant.variantProperties;

          if (
            variantProps &&
            variantProps["Auto Width"] === "False" && // Handle only Auto Width = False
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
              Dense === "True" ? "&.MuiList-dense" : ":not(&.MuiList-dense)";
            const guttersSelector =
              DisGutters === "True"
                ? "&.MuiList-padding"
                : ":not(&.MuiList-padding)";

            // Extract padding using menuVariant directly
            const padding = styles.getPaddingCss(menuVariant);

            // Apply padding to the appropriate config object
            Object.assign(
              menuListConfig[screenSizeKey][guttersSelector][denseSelector],
              padding
            );
          }
        }
      });
    }
  });

  // Wrap menuListConfig in the specified structure
  return {
    MuiMenuList: {
      styleOverrides: {
        root: menuListConfig,
      },
    },
  };
}
