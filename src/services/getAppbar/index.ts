import { rgbToHex } from "../../utils";

interface AppBarVariantConfig {
  [selector: string]: {
    [property: string]: any;
  };
}

interface AppBarConfig {
  MuiAppBar: {
    styleOverrides: {
      root: {
        [key: string]: AppBarVariantConfig;
      };
    };
  };
}

export default function getAppBar() {
  console.log("Fetching AppBar...");

  const appBarConfig: AppBarConfig = {
    MuiAppBar: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const appBarPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "App Bar"
  );

  if (!appBarPage) {
    return appBarConfig;
  }

  const appBarComponents = appBarPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<AppBar>"
  ) as ComponentSetNode[];

  const positions = ["Static", "Fixed", "Absolute", "Sticky", "Relative"]; // Add all positions dynamically.

  appBarComponents.forEach((appBarComponentSet) => {
    if (appBarComponentSet.type === "COMPONENT_SET") {
      appBarComponentSet.children.forEach((appBarVariant) => {
        if (appBarVariant.type === "COMPONENT") {
          const variantProps = appBarVariant.variantProperties;

          if (variantProps && "Color" in variantProps) {
            const { Color } = variantProps;

            // Find the `<Paper>` node inside the variant
            const paperNode = appBarVariant.findChild(
              (child) => child.type === "INSTANCE" && child.name === "<Paper>"
            );

            let backgroundColor = "";

            if (paperNode && "fills" in paperNode) {
              const fills = paperNode.fills as Paint[];
              if (fills.length > 0 && fills[0].type === "SOLID") {
                backgroundColor = rgbToHex({
                  ...(fills[0] as SolidPaint).color,
                  a: (fills[0] as SolidPaint).opacity ?? 1, // Fallback to 1 if opacity is undefined
                });
              }
            }

            // Dynamically create selectors for all positions
            positions.forEach((position) => {
              const selector = `&.MuiPaper-root&.MuiPaper-elevation&.MuiAppBar-position${position}`;
              appBarConfig.MuiAppBar.styleOverrides.root[selector] ??= {};
              appBarConfig.MuiAppBar.styleOverrides.root[selector][
                `&.MuiAppBar-color${Color}`
              ] = {
                ...(backgroundColor ? { background: backgroundColor } : {}),
              };
            });
          }
        }
      });
    }
  });

  return appBarConfig;
}
