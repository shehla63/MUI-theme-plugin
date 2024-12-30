import { styles } from "../../utils";

export default function getTableHead() {
  const tablePage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Table"
  );

  if (!tablePage) {
    console.log("Table page not found.");
    return {};
  }

  // Locate the main TableHeadRow component set
  const tableHeadRowComponentSet = tablePage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<TableHeadRow>"
  ) as ComponentSetNode;

  if (!tableHeadRowComponentSet) {
    console.log("<TableHeadRow> component set not found.");
    return {};
  }

  // Define an object to store the variant-based styles for Columns="3"
  const tableHeadRowStyles: Record<string, any> = {};

  // Process each variant for <TableHeadRow>
  tableHeadRowComponentSet.children.forEach((tableHeadVariant) => {
    if (
      tableHeadVariant.type === "COMPONENT" &&
      tableHeadVariant.variantProperties
    ) {
      const { Checkbox, Selected, Small, Columns } =
        tableHeadVariant.variantProperties;

      // Only handle variants where Columns is "3"
      if (Columns === "3" && Checkbox === "False") {
        // Find <TableHead> element within the variant to retrieve padding
        const tableHeadElement = tableHeadVariant.children.find(
          (node) => node.name === "<TableHead>"
        ) as InstanceNode;

        // Retrieve padding from <TableHead>
        const headPadding = styles.getPaddingCss(tableHeadElement || {});

        // Retrieve borders from the tableHeadVariant itself
        const headBorders = styles.getBordersCss(tableHeadVariant);

        // Find the "Head" node within <TableHead> for font properties
        const headElement = tableHeadElement.children.find(
          (node) => node.name === "Head"
        ) as InstanceNode;

        const headFontFamily = styles.getFontFamilyCss(headElement);
        const headFontSize = styles.getFontSizeCss(headElement);
        const headLetterSpacing = styles.getLetterSpacingCss(headElement);
        const headFontWeight = styles.getFontWeightCss(headElement);
        const headLineHeight = styles.getLineHeightCss(headElement);
        const color = styles.getColorOrBackgroundCss(headElement, "color");

        // Build style object for the variant
        const variantKey =
          Small === "True"
            ? `&.MuiTableCell-sizeSmall`
            : `&.MuiTableCell-sizeMedium`;

        const variantStyles = {
          ...headFontFamily,
          ...headFontSize,
          ...headLetterSpacing,
          ...headBorders,
          ...headFontWeight,
          ...headLineHeight,
          ...color,
          ...(Small ? styles.getPaddingCss(tableHeadElement) : headPadding),
        };

        // Store styles based on variantKey (Checkbox, Selected, Small)
        tableHeadRowStyles[variantKey] = variantStyles;
      }
    }
  });

  // Define and return the final style configuration for MuiTable
  return tableHeadRowStyles;
}
