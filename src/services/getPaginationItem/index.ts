import { styles } from "../../utils";

export default function getPaginationItem() {
  console.log("Fetching Pagination Item...");

  const paginationPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Pagination"
  );

  if (!paginationPage) {
    console.log("Pagination page not found.");
    return {};
  }

  const paginationConfig: Record<string, any> = {
    root: {
      ":not(&.Mui-disabled)": {}, // Disabled = False
      "&.Mui-disabled": {}, // Disabled = True
    },
  };

  const allPaginationComponents = paginationPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<PaginationItem>"
  ) as ComponentSetNode[];

  allPaginationComponents.forEach((paginationComponentSet) => {
    paginationComponentSet.children.forEach((paginationVariant) => {
      if (paginationVariant.type === "COMPONENT") {
        const variantProps = paginationVariant.variantProperties;

        if (
          variantProps &&
          "Active" in variantProps &&
          "Icon" in variantProps &&
          "Size" in variantProps &&
          "Variant" in variantProps &&
          "Shape" in variantProps &&
          "Color" in variantProps &&
          "Disabled" in variantProps
        ) {
          const { Active, Icon, Size, Variant, Shape, Color, Disabled } =
            variantProps;

          // Determine selectors for each property
          const activeSelector =
            Active === "True" ? "&.Mui-selected" : ":not(&.Mui-selected)";
          const iconSelector =
            Icon === "True"
              ? "&.MuiPaginationItem-previousNext"
              : ":not(&.MuiPaginationItem-previousNext)";
          const sizeSelector = `&.MuiPaginationItem-size${
            Size.charAt(0).toUpperCase() + Size.slice(1)
          }`;
          const variantSelector = `&.MuiPaginationItem-${Variant.toLowerCase()}`;
          const shapeSelector = `&.MuiPaginationItem-${Shape.toLowerCase()}`;
          const disabledSelector =
            Disabled === "True" ? "&.Mui-disabled" : ":not(&.Mui-disabled)";

          // If Color is "Standard," skip the color class and apply directly under disabledSelector
          const targetConfig =
            paginationConfig.root[disabledSelector] ||
            (paginationConfig.root[disabledSelector] = {});

          const colorConfig =
            Color === "Standard*"
              ? targetConfig // Apply directly if Color is "Standard"
              : targetConfig[
                  `&.MuiPaginationItem-color${
                    Color.charAt(0).toUpperCase() + Color.slice(1)
                  }`
                ] ||
                (targetConfig[
                  `&.MuiPaginationItem-color${
                    Color.charAt(0).toUpperCase() + Color.slice(1)
                  }`
                ] = {});

          const shapeConfig =
            colorConfig[shapeSelector] || (colorConfig[shapeSelector] = {});
          const sizeConfig =
            shapeConfig[sizeSelector] || (shapeConfig[sizeSelector] = {});
          const variantConfig =
            sizeConfig[variantSelector] || (sizeConfig[variantSelector] = {});
          const activeConfig =
            variantConfig[activeSelector] ||
            (variantConfig[activeSelector] = {});
          const iconConfig =
            activeConfig[iconSelector] || (activeConfig[iconSelector] = {});

          // Apply CSS styles
          const baseStyles = getPaginationItemStyles(paginationVariant);
          Object.assign(iconConfig, baseStyles);
        }
      }
    });
  });

  return {
    MuiPaginationItem: {
      styleOverrides: paginationConfig,
    },
  };
}

// Helper function to extract pagination styles for the given variant
function getPaginationItemStyles(element: any) {
  // Directly get width and height from the element node
  const width = styles.getWidthCss(element);
  const height = styles.getHeightCss(element);

  // Locate the child with the name "<ButtonBase>" for background color, border, and border radius
  const buttonBaseNode = element.children.find(
    (node: any) => node.name === "<ButtonBase>"
  );
  const backgroundColor = buttonBaseNode
    ? styles.getColorOrBackgroundCss(buttonBaseNode, "backgroundColor")
    : {};
  const border = buttonBaseNode ? styles.getBordersCss(buttonBaseNode) : {};
  const borderRadius = buttonBaseNode
    ? styles.getBorderRadiusCss(buttonBaseNode)
    : {};

  // Locate the child of <ButtonBase> named "label" for font-related styles
  const labelNode = buttonBaseNode?.children.find(
    (node: any) => node.name === "Label"
  );
  const fontWeight = labelNode ? styles.getFontWeightCss(labelNode) : {};
  const fontSize = labelNode ? styles.getFontSizeCss(labelNode) : {};
  const fontFamily = labelNode ? styles.getFontFamilyCss(labelNode) : {};

  // Combine and return all extracted styles
  return {
    ...width,
    ...height,
    ...backgroundColor,
    ...border,
    ...borderRadius,
    ...fontWeight,
    ...fontSize,
    ...fontFamily,
  };
}
