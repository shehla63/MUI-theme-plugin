import { styles } from "../../utils";
import getStep from "../getStep";

export default function getStepper() {
  console.log("Fetching Stepper...");

  const stepPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Stepper"
  );

  if (!stepPage) {
    console.log("Step page not found.");
    return {};
  }

  const stepperConfig: Record<string, any> = {
    sm: {
      "&.MuiStepper-horizontal": {
        "& .MuiStepLabel-horizontal": {},
        "& .MuiStepConnector-line": {},
      },
      "&.MuiStepper-vertical": {
        "& .MuiStepLabel-vertical": {},
        "& .MuiStepConnector-line": {},
      },
    },
    md: {
      "&.MuiStepper-horizontal": {
        "& .MuiStepLabel-horizontal": {},
        "& .MuiStepConnector-line": {},
      },
      "&.MuiStepper-vertical": {
        "& .MuiStepLabel-vertical": {},
        "& .MuiStepConnector-line": {},
      },
    },
  };

  const allStepComponents = stepPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Stepper>"
  ) as ComponentSetNode[];

  allStepComponents.forEach((stepComponentSet) => {
    if (stepComponentSet.type === "COMPONENT_SET") {
      stepComponentSet.children.forEach((stepVariant) => {
        if (stepVariant.type === "COMPONENT") {
          const {
            "Small Screen": smallScreen,
            Optional,
            Text,
            Alignment,
          } = stepVariant.variantProperties || {};

          if (
            Text === "Left" &&
            Optional === "true" &&
            ["Horizontal*", "Vertical"].includes(Alignment)
          ) {
            const alignmentClass =
              Alignment === "Horizontal*"
                ? "&.MuiStepper-horizontal"
                : "&.MuiStepper-vertical";
            const screenClass = smallScreen === "true" ? "sm" : "md";

            // Main Node => Step
            const stepNode = stepVariant.children.find(
              (node) => node.name === "Step"
            );

            const alignmentType =
              Alignment === "Horizontal*" ? "horizontal" : "vertical";

            if (stepNode) {
              const gapStyles = styles.getGapCss(stepNode);
              stepperConfig[screenClass][alignmentClass][
                `& .MuiStepLabel-${alignmentType}`
              ] = {
                ...gapStyles,
              };
            }

            // Main Node => Connector
            if (Alignment === "Horizontal*") {
              const connectorNode = stepVariant.children.find(
                (node) => node.name === "Connector"
              );
              if (connectorNode) {
                const backgroundStyles = styles.getColorOrBackgroundCss(
                  connectorNode,
                  "background"
                );
                stepperConfig[screenClass][alignmentClass][
                  "& .MuiStepConnector-line"
                ] = {
                  borderColor: backgroundStyles.background,
                };
              }
            } else if (Alignment === "Vertical") {
              const maskNode = stepVariant.children.find(
                (node) => node.name === "mask"
              );
              if (maskNode && "children" in maskNode) {
                const connectorNode = maskNode.children.find(
                  (node) => node.name === "Connector"
                );
                if (connectorNode) {
                  const backgroundStyles = styles.getColorOrBackgroundCss(
                    connectorNode,
                    "background"
                  );
                  stepperConfig[screenClass][alignmentClass][
                    "& .MuiStepConnector-line"
                  ] = {
                    borderColor: backgroundStyles.background,
                  };
                }
              }
            }
          }
        }
      });
    }
  });

  return {
    MuiStepper: {
      styleOverrides: {
        root: stepperConfig,
      },
    },
  };
}
