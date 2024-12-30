import { styles } from "../../utils";

export default function getBreadcrumbs() {
  console.log("Fetching Breadcrumbs...");

  const breadcrumbsPage = figma.root.children.find(
    (node) => node.name.trim() === "Breadcrumbs"
  );

  if (!breadcrumbsPage) {
    console.log("Breadcrumbs page not found.");
    return {};
  }

  const breadcrumbsComponent = breadcrumbsPage.findAll(
    (node) => node.name === "<Breadcrumbs>"
  ) as ComponentSetNode[];

  if (!breadcrumbsComponent) {
    console.log("Breadcrumbs component not found.");
    return {};
  }

  const result: any = {
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          "& .MuiBreadcrumbs-separator": {},
          "& button": {
            "& svg": {
              background: null,
              color: null,
            },
          },
        },
      },
    },
  };

  breadcrumbsComponent.forEach((breadcrumbsComponentSet) => {
    if (breadcrumbsComponentSet.type === "COMPONENT_SET") {
      breadcrumbsComponentSet.children.forEach((singleBreadcrumb) => {
        if (singleBreadcrumb.type === "COMPONENT") {
          const variantProps = singleBreadcrumb.variantProperties;

          // Handle only Collapsed: True and Separator: Icon
          if (
            variantProps?.Collapsed === "True" &&
            variantProps?.Separator === "Icon"
          ) {
            // Get separator details
            const separatorNode = singleBreadcrumb.children.find(
              (node) => node.name === "Separator"
            );

            if (separatorNode && "children" in separatorNode) {
              const chevronRightFilled = separatorNode.children.find(
                (node) => node.name === "ChevronRightFilled"
              );

              if (chevronRightFilled && "children" in chevronRightFilled) {
                const vectorNode = chevronRightFilled.children.find(
                  (node) => node.name === "Vector"
                );

                if (vectorNode) {
                  const colorCss = styles.getColorOrBackgroundCss(
                    vectorNode,
                    "color"
                  );
                  result.MuiBreadcrumbs.styleOverrides.root[
                    "& .MuiBreadcrumbs-separator"
                  ] = {
                    ...colorCss,
                  };
                }
              } else {
                const slashNode = separatorNode.children.find(
                  (node) => node.name === "/"
                );

                if (slashNode) {
                  const colorCss = styles.getColorOrBackgroundCss(
                    slashNode,
                    "color"
                  );

                  result.MuiBreadcrumbs.styleOverrides.root[
                    "& .MuiBreadcrumbs-separator"
                  ] = {
                    ...colorCss,
                  };
                }
              }
            }

            // Get SVG details
            const breadcrumbCollapsedNode = singleBreadcrumb.children.find(
              (node) => node.name === "Breadcrumb / Collapsed"
            );

            if (
              breadcrumbCollapsedNode &&
              "children" in breadcrumbCollapsedNode
            ) {
              const maskNode = breadcrumbCollapsedNode.children.find(
                (node) => node.name === "Mask"
              );

              if (maskNode) {
                result.MuiBreadcrumbs.styleOverrides.root["& button"]["& svg"] =
                  {
                    ...styles.getColorOrBackgroundCss(maskNode, "background"),
                    ...styles.getBorderRadiusCss(maskNode),
                  };
              }

              let moreHorizFilledNode: any = {};

              if (maskNode && "children" in maskNode) {
                moreHorizFilledNode = maskNode.children.find(
                  (node) => node.name === "MoreHorizFilled"
                );
              }

              if (moreHorizFilledNode && "children" in moreHorizFilledNode) {
                const vectorNode = moreHorizFilledNode.children.find(
                  (node: any) => node.name === "Vector"
                );

                if (vectorNode) {
                  const colorCss = styles.getColorOrBackgroundCss(
                    vectorNode,
                    "color"
                  );
                  result.MuiBreadcrumbs.styleOverrides.root["& button"][
                    "& svg"
                  ].color = colorCss.color;
                }
              }
            }
          }
        }
      });
    }
  });

  return result;
}
