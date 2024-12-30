import { styles } from "../../utils";

export default function getAccordion() {
  console.log("Fetching Accordion");

  const accordionPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Accordion"
  );

  if (!accordionPage) {
    console.log("Accordion page not found.");
    return {};
  }

  const accordionPageComponent = accordionPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Accordion>"
  ) as ComponentSetNode;

  if (!accordionPageComponent) {
    console.log("Accordion component set not found.");
    return {};
  }

  const accordionConfig: Record<string, any> = {
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&.MuiPaper-rounded&.MuiPaper-elevation": {
            "&:first-of-type": {
              // Disabled: False, First-of-type: True
              ...{},
              "&.Mui-disabled": {
                // Disabled: True, First-of-type: True
              },
            },
            "&:last-of-type": {
              // Disabled: False, Last-of-type: True
              ...{},
              "&.Mui-disabled": {
                // Disabled: True, Last-of-type: True
              },
            },
            "&:not(:first-of-type):not(:last-of-type)": {
              // Disabled: False, First-of-type: False, Last-of-type: False
              ...{},
              "&.Mui-disabled": {
                // Disabled: True, First-of-type: False, Last-of-type: False
              },
            },
          },
        },
      },
    },
  };

  accordionPageComponent.children.forEach((accordionVariant) => {
    if (accordionVariant.type === "COMPONENT") {
      const variantProps = accordionVariant.variantProperties;

      if (
        variantProps &&
        "Disabled" in variantProps &&
        "First-of-type" in variantProps &&
        "Expanded?" in variantProps &&
        "Last-of-type" in variantProps
      ) {
        const {
          Disabled,
          "First-of-type": isFirst,
          "Last-of-type": isLast,
          "Expanded?": isExpanded,
        } = variantProps;

        // Process only when Expanded? is "False"
        if (isExpanded === "False") {
          const summaryNode = accordionVariant.children.find(
            (node: SceneNode) =>
              node.name === "AccordionSummary" &&
              "children" in node &&
              Array.isArray((node as FrameNode).children)
          );

          const containerNode =
            summaryNode &&
            "children" in summaryNode &&
            Array.isArray((summaryNode as FrameNode).children)
              ? (summaryNode as FrameNode).children.find(
                  (node: SceneNode) =>
                    node.name === "Container" &&
                    "children" in node &&
                    Array.isArray((node as FrameNode).children)
                )
              : null;

          // Extract styles
          const padding = styles.getPaddingCss(containerNode);
          const background = styles.getColorOrBackgroundCss(
            containerNode,
            "background"
          );
          const borderRadius = styles.getBorderRadiusCss(summaryNode);
          const boxShadow = styles.getBoxShadowCSS(summaryNode);

          const combinedStyles = {
            ...padding,
            ...background,
            ...borderRadius,
            ...boxShadow,
          };

          // Handle styles based on variant properties
          if (isFirst === "True" && isLast === "False") {
            if (Disabled === "True") {
              accordionConfig.MuiAccordion.styleOverrides.root[
                "&.MuiPaper-rounded&.MuiPaper-elevation"
              ]["&:first-of-type"]["&.Mui-disabled"] = combinedStyles;
            } else {
              accordionConfig.MuiAccordion.styleOverrides.root[
                "&.MuiPaper-rounded&.MuiPaper-elevation"
              ]["&:first-of-type"] = {
                ...accordionConfig.MuiAccordion.styleOverrides.root[
                  "&.MuiPaper-rounded&.MuiPaper-elevation"
                ]["&:first-of-type"],
                ...combinedStyles,
              };
            }
          } else if (isLast === "True" && isFirst === "False") {
            if (Disabled === "True") {
              accordionConfig.MuiAccordion.styleOverrides.root[
                "&.MuiPaper-rounded&.MuiPaper-elevation"
              ]["&:last-of-type"]["&.Mui-disabled"] = combinedStyles;
            } else {
              accordionConfig.MuiAccordion.styleOverrides.root[
                "&.MuiPaper-rounded&.MuiPaper-elevation"
              ]["&:last-of-type"] = {
                ...accordionConfig.MuiAccordion.styleOverrides.root[
                  "&.MuiPaper-rounded&.MuiPaper-elevation"
                ]["&:last-of-type"],
                ...combinedStyles,
              };
            }
          } else if (isFirst === "False" && isLast === "False") {
            if (Disabled === "True") {
              accordionConfig.MuiAccordion.styleOverrides.root[
                "&.MuiPaper-rounded&.MuiPaper-elevation"
              ]["&:not(:first-of-type):not(:last-of-type)"]["&.Mui-disabled"] =
                combinedStyles;
            } else {
              accordionConfig.MuiAccordion.styleOverrides.root[
                "&.MuiPaper-rounded&.MuiPaper-elevation"
              ]["&:not(:first-of-type):not(:last-of-type)"] = {
                ...accordionConfig.MuiAccordion.styleOverrides.root[
                  "&.MuiPaper-rounded&.MuiPaper-elevation"
                ]["&:not(:first-of-type):not(:last-of-type)"],
                ...combinedStyles,
              };
            }
          }
        }
      }
    }
  });

  return accordionConfig;
}
