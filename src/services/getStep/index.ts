import { styles } from "../../utils";

export default function getStep() {
  console.log("Fetching Step...");

  const stepPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Stepper"
  );

  if (!stepPage) {
    console.log("Step page not found.");
    return {};
  }

  const stepConfig: Record<string, any> = {};

  const allStepComponents = stepPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Step>"
  ) as ComponentSetNode[];

  allStepComponents.forEach((stepComponentSet) => {
    if (stepComponentSet.type === "COMPONENT_SET") {
      stepComponentSet.children.forEach((stepVariant) => {
        if (stepVariant.type === "COMPONENT") {
          const { Text, State } = stepVariant.variantProperties || {};

          if (
            Text === "Left" &&
            ["Inactive", "Active", "Complete"].includes(State)
          ) {
            const stateClass =
              State === "Inactive"
                ? "& .Mui-disabled"
                : State === "Active"
                ? "& .Mui-active"
                : "& .Mui-completed";

            if (!stepConfig[stateClass]) {
              stepConfig[stateClass] = {
                "& .MuiSvgIcon-root": {},
                "& + .MuiStepLabel-labelContainer": {
                  "& .MuiStepLabel-label": {},
                },
              };
            }

            // Locate Base Step Elements
            const baseStepElements = stepVariant.children.find(
              (node) => node.name === "Base Step Elements"
            );
            if (!baseStepElements || !("children" in baseStepElements)) {
              console.warn("Base Step Elements node not found.");
              return;
            }

            if (State === "Complete") {
              // Base Step Elements => Ellipse 1
              const ellipse1 = baseStepElements.children.find(
                (node) => node.name === "Ellipse 1"
              );
              if (ellipse1) {
                const borderColor = styles.getColorOrBackgroundCss(
                  ellipse1,
                  "color"
                );
                stepConfig[stateClass]["& .MuiSvgIcon-root"] = {
                  ...borderColor,
                };
              }

              // Base Step Elements => CheckFilled => Vector
              const checkFilled = baseStepElements.children.find(
                (node) => node.name === "CheckFilled"
              );
              if (checkFilled && "children" in checkFilled) {
                const vector = checkFilled.children.find(
                  (node) => node.name === "Vector"
                );
                if (vector) {
                  const textColor = styles.getColorOrBackgroundCss(
                    vector,
                    "color"
                  );
                  stepConfig[stateClass]["& .MuiSvgIcon-root"][
                    "& .MuiStepIcon-text"
                  ] = {
                    ...textColor,
                  };
                }
              }
            } else {
              // For Inactive and Active states

              // Base Step Elements
              const baseColor = styles.getColorOrBackgroundCss(
                baseStepElements,
                "color"
              );
              stepConfig[stateClass]["& .MuiSvgIcon-root"] = {
                ...baseColor,
              };

              // Base Step Elements => Value
              const valueNode = baseStepElements.children.find(
                (node) => node.name === "Value"
              );
              if (valueNode) {
                const valueColor = styles.getColorOrBackgroundCss(
                  valueNode,
                  "color"
                );
                stepConfig[stateClass]["& .MuiSvgIcon-root"][
                  "& .MuiStepIcon-text"
                ] = {
                  ...valueColor,
                };
              }
            }

            // Locate Content
            const content = stepVariant.children.find(
              (node) => node.name === "Content"
            );
            if (!content || !("children" in content)) {
              console.warn("Content node not found.");
              return;
            }

            // Content => Step Title => Vector
            const stepTitle = content.children.find(
              (node) => node.name === "Step title"
            );
            if (stepTitle) {
              const titleStyles = {
                ...styles.getColorOrBackgroundCss(stepTitle, "color"),
                ...styles.getFontSizeCss(stepTitle),
                ...styles.getLetterSpacingCss(stepTitle),
                ...styles.getFontWeightCss(stepTitle),
                ...styles.getLineHeightCss(stepTitle),
              };
              stepConfig[stateClass]["& + .MuiStepLabel-labelContainer"][
                "& .MuiStepLabel-label"
              ] = {
                ...titleStyles,
              };
            }

            // Content => Optional => Vector
            const optional = content.children.find(
              (node) => node.name === "Optional"
            );
            if (optional) {
              const optionalStyles = {
                ...styles.getColorOrBackgroundCss(optional, "color"),
                ...styles.getFontSizeCss(optional),
                ...styles.getLetterSpacingCss(optional),
                ...styles.getFontWeightCss(optional),
                ...styles.getLineHeightCss(optional),
              };
              stepConfig[stateClass]["& + .MuiStepLabel-labelContainer"] = {
                ...stepConfig[stateClass]["& + .MuiStepLabel-labelContainer"],
                ...optionalStyles,
              };
            }
          }
        }
      });
    }
  });

  return {
    MuiStep: {
      styleOverrides: {
        root: stepConfig,
      },
    },
  };
}
