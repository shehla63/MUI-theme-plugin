import { styles } from "../../utils";

export default function getPagination() {
  console.log("Fetching Pagination...");

  const paginationPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Pagination"
  );

  if (!paginationPage) {
    console.log("Pagination page not found.");
    return {};
  }

  const paginationConfig: Record<string, any> = {
    root: {},
  };

  const allPaginationComponents = paginationPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Pagination>"
  ) as ComponentSetNode[];

  allPaginationComponents.forEach((paginationComponentSet) => {
    paginationComponentSet.children.forEach((paginationVariant) => {
      if (paginationVariant.type === "COMPONENT") {
        const variantProps = paginationVariant.variantProperties;

        if (
          variantProps &&
          variantProps.Disabled === "False" &&
          variantProps.Variant === "Text" &&
          variantProps.Color === "Standard" &&
          variantProps.Shape === "Circular"
        ) {
          const { Size } = variantProps;

          // Construct the selector for the specific size
          const sizeSelector = `.MuiPagination-ul:has(.MuiPaginationItem-size${
            Size.charAt(0).toUpperCase() + Size.slice(1)
          })`;

          // Extract padding and gap properties directly from the main node
          const padding = styles.getPaddingCss(paginationVariant);
          const gap = styles.getGapCss(paginationVariant);

          // Assign padding and gap to the specific size selector within the root
          paginationConfig.root[sizeSelector] = {
            ...padding,
            ...gap,
          };
        }
      }
    });
  });

  return {
    MuiPagination: {
      styleOverrides: paginationConfig,
    },
  };
}
