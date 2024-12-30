import { styles } from "../../utils";

export default function getMobileStepper() {
  console.log("Fetching Mobile Stepper...");

  const stepPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Stepper"
  );

  if (!stepPage) {
    console.log("Step page not found.");
    return {};
  }

  const mobileStepperConfig: Record<string, any> = {
    "& .MuiMobileStepper-dot": {
      // Non-active styles go here
      "&.MuiMobileStepper-dotActive": {
        // Active styles go here
      },
    },
  };

  const mobileStepperComponents = stepPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<MobileStepper>"
  ) as ComponentSetNode[];

  mobileStepperComponents.forEach((mobileStepperComponent) => {
    if (mobileStepperComponent.type === "COMPONENT_SET") {
      mobileStepperComponent.children.forEach((mobileStepperVariant) => {
        if (mobileStepperVariant.type === "COMPONENT") {
          const { "Progress Type": progressType = "" } =
            mobileStepperVariant.variantProperties || {};

          if (progressType === "Dots") {
            const dotsLayer = mobileStepperVariant.children.find(
              (node) => node.name === "dots"
            );

            if (dotsLayer && "children" in dotsLayer) {
              // Active Dot
              const activeDotNode = dotsLayer.children.find(
                (node) => node.name === "stepper/dot/active"
              );
              let activeEllipseNode;

              if (activeDotNode && "children" in activeDotNode) {
                activeEllipseNode = activeDotNode.children.find(
                  (node: any) => node.name === "Ellipse 5"
                );
              }

              // Non-Active Dot
              const inactiveDotNode = dotsLayer.children.find(
                (node) => node.name === "stepper/dot/inactive"
              );
              let inactiveEllipseNode;

              if (inactiveDotNode && "children" in inactiveDotNode) {
                inactiveEllipseNode = inactiveDotNode.children.find(
                  (node: any) => node.name === "Ellipse 5"
                );
              }

              // Extract Non-Active Dot Styles
              if (inactiveDotNode) {
                mobileStepperConfig["& .MuiMobileStepper-dot"] = {
                  ...styles.getBorderRadiusCss(inactiveDotNode), // Border radius
                  ...(inactiveEllipseNode
                    ? {
                        ...styles.getWidthCss(inactiveEllipseNode), // Width
                        ...styles.getHeightCss(inactiveEllipseNode), // Height
                        ...styles.getColorOrBackgroundCss(
                          inactiveEllipseNode,
                          "backgroundColor"
                        ), // Background color
                      }
                    : {}),
                  // Active Dot Styles nested inside
                  "&.MuiMobileStepper-dotActive": {
                    ...styles.getBorderRadiusCss(activeDotNode), // Border radius
                    ...(activeEllipseNode
                      ? {
                          ...styles.getWidthCss(activeEllipseNode), // Width
                          ...styles.getHeightCss(activeEllipseNode), // Height
                          ...styles.getColorOrBackgroundCss(
                            activeEllipseNode,
                            "backgroundColor"
                          ), // Background color
                        }
                      : {}),
                  },
                };
              }
            }
          }
        }
      });
    }
  });

  return {
    MuiMobileStepper: {
      styleOverrides: {
        root: mobileStepperConfig,
      },
    },
  };
}
