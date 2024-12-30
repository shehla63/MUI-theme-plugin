import { styles } from "../../utils";

export default function getTableCellRow() {
  const tablePage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Table"
  );

  if (!tablePage) {
    console.log("Table page not found.");
    return {};
  }

  // Locate the main TableCellRow component set
  const tableCellRowComponentSet = tablePage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<TableCellRow>"
  ) as ComponentSetNode;

  if (!tableCellRowComponentSet) {
    console.log("<TableCellRow> component set not found.");
    return {};
  }

  // Initialize the final style object
  const tableCellRowStyles = {
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            "&:has(.MuiTableCell-sizeMedium)": {},
            "&:has(.MuiTableCell-sizeSmall)": {},
            ".MuiTableCell-sizeMedium": {},
            ".MuiTableCell-sizeSmall": {},
          },
          "&:not(.Mui-selected)": {
            "&:has(.MuiTableCell-sizeMedium)": {},
            "&:has(.MuiTableCell-sizeSmall)": {},
            ".MuiTableCell-sizeMedium": {},
            ".MuiTableCell-sizeSmall": {},
          },
        },
      },
    },
  };

  // Process each variant for <TableCellRow>
  tableCellRowComponentSet.children.forEach((tableCellVariant) => {
    if (
      tableCellVariant.type === "COMPONENT" &&
      tableCellVariant.variantProperties
    ) {
      const { Checkbox, Selected, Small, Columns, Divider, Hover } =
        tableCellVariant.variantProperties;

      // Only handle variants where Columns is "3", Checkbox is "False", and Divider is "True"
      if (Columns === "3" && Checkbox === "False" && Divider === "True") {
        // Retrieve borders and background directly from tableCellVariant
        const cellBorders = styles.getBordersCss(tableCellVariant);
        const cellBackground = styles.getColorOrBackgroundCss(
          tableCellVariant,
          "backgroundColor"
        );

        // Locate the "Cell #1" node to retrieve padding
        const cellElement = tableCellVariant.children.find(
          (node) => node.name === "Cell #1"
        ) as InstanceNode;

        const cellPadding = styles.getPaddingCss(cellElement || {});

        // Within "Cell #1", locate the "Box" node, then find <Typography> for font properties
        const boxElement = cellElement.children.find(
          (node) => node.name === "Box"
        ) as InstanceNode;

        const typographyElement = boxElement?.children.find(
          (node) => node.name === "<Typography>"
        ) as InstanceNode;

        const fontFamily = styles.getFontFamilyCss(typographyElement);
        const fontSize = styles.getFontSizeCss(typographyElement);
        const letterSpacing = styles.getLetterSpacingCss(typographyElement);
        const fontWeight = styles.getFontWeightCss(typographyElement);
        const lineHeight = styles.getLineHeightCss(typographyElement);
        const color = styles.getColorOrBackgroundCss(
          typographyElement,
          "color"
        );

        // Assemble the base style object for the variant
        const variantStyles = {
          ...fontFamily,
          ...fontSize,
          ...letterSpacing,
          ...cellBorders,
          ...cellBackground,
          ...fontWeight,
          ...lineHeight,
          ...color,
          ...cellPadding,
        };

        // Determine cell size class name based on Small property
        const cellSizeClass =
          Small === "True"
            ? ".MuiTableCell-sizeSmall"
            : ".MuiTableCell-sizeMedium";

        // Define base styles for selected and non-selected states
        if (Selected === "True" && Hover === "False") {
          (tableCellRowStyles.MuiTableRow.styleOverrides.root["&.Mui-selected"][
            cellSizeClass
          ] as any) = { ...variantStyles };

          (tableCellRowStyles.MuiTableRow.styleOverrides.root["&.Mui-selected"][
            `&:has(${cellSizeClass})`
          ] as any) = { ...cellBackground };
        } else if (Selected === "True" && Hover === "True") {
          (
            tableCellRowStyles.MuiTableRow.styleOverrides.root[
              "&.Mui-selected"
            ] as any
          )["&:hover"] = { ...variantStyles };
        }

        if (Selected === "False" && Hover === "False") {
          (tableCellRowStyles.MuiTableRow.styleOverrides.root[
            "&:not(.Mui-selected)"
          ][cellSizeClass] as any) = { ...variantStyles };

          (tableCellRowStyles.MuiTableRow.styleOverrides.root["&.Mui-selected"][
            `&:has(${cellSizeClass})`
          ] as any) = { ...cellBackground };

          // Apply hover styles conditionally
        } else if (Selected === "False" && Hover === "True") {
          (
            tableCellRowStyles.MuiTableRow.styleOverrides.root[
              "&:not(.Mui-selected)"
            ] as any
          )["&:hover"] = { ...variantStyles };
        }
      }
    }
  });

  // Return the final structured style configuration
  return tableCellRowStyles;
}
