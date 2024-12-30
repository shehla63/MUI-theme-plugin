interface ToolbarVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}
interface ToolbarConfig {
  MuiToolbar: {
    styleOverrides: {
      [key: string]: {
        padding: string;
      };
    };
  };
}
export default function getToolbar() {
  console.log("Fetching Toolbar...");

  const toolbarConfig: ToolbarConfig = {
    MuiToolbar: {
      styleOverrides: {},
    },
  };

  const appBarPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "App Bar"
  );

  if (!appBarPage) {
    return {};
  }

  const toolbarComponents = appBarPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Toolbar>"
  ) as ComponentSetNode[];

  toolbarComponents.forEach((toolbarComponentSet) => {
    if (toolbarComponentSet.type === "COMPONENT_SET") {
      toolbarComponentSet.children.forEach((toolbarVariant) => {
        if (toolbarVariant.type === "COMPONENT") {
          const variantProps = toolbarVariant.variantProperties;

          if (variantProps && "Variant" in variantProps) {
            const { Variant } = variantProps;
            const toolbarKey = `${Variant.toLowerCase()}`;
            const padding = `${toolbarVariant.paddingTop}px ${toolbarVariant.paddingRight}px ${toolbarVariant.paddingBottom}px ${toolbarVariant.paddingLeft}px`;

            // Use the correct indexing to avoid the TypeScript error
            toolbarConfig.MuiToolbar.styleOverrides[toolbarKey] = {
              padding,
            };
          }
        }
      });
    }
  });

  return toolbarConfig;
}
