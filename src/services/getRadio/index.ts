import { rgbToHex } from "../../utils";

export default function getRadioButton() {
  console.log("Fetching Radio...");

  const radioButtonPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.includes("Radio")
  );

  if (!radioButtonPage) {
    console.log("Radio button page not found.");
    return {};
  }

  const radioButtonConfig: Record<string, any> = {};

  const allRadioComponents = radioButtonPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Radio>"
  ) as ComponentSetNode[];

  allRadioComponents.forEach((radioComponentSet) => {
    if (radioComponentSet.type === "COMPONENT_SET") {
      radioComponentSet.children.forEach((radioVariant) => {
        if (radioVariant.type === "COMPONENT") {
          const variantProps = radioVariant.variantProperties;

          if (
            variantProps &&
            "Checked" in variantProps &&
            "Size" in variantProps &&
            "State" in variantProps &&
            "Color" in variantProps
          ) {
            const { Checked, State, Size, Color } = variantProps;
            const isChecked = Checked === "True";
            const colorClass = `&.MuiRadio-color${Color}`;
            const checkedClass = isChecked
              ? "&.Mui-checked"
              : "&:not(.Mui-checked)";
            const stateClass = State === "Disabled" ? "&.Mui-disabled" : "";

            // Find ripple and padding nodes as before
            const ripple = radioVariant.children.find(
              (node) => node.name === "focusRipple"
            ) as RectangleNode;
            const paddingNode = radioVariant.children.find(
              (node) => node.name === "Padding"
            ) as FrameNode;

            const {
              verticalPadding = "",
              horizontalPadding = "",
              width = "",
              height = "",
            } = paddingNode || {};

            // Apply the sizeMedium properties directly at the root level
            if (Size === "Medium") {
              radioButtonConfig["width"] = `${width}px`;
              radioButtonConfig["height"] = `${height}px`;
              radioButtonConfig[
                "padding"
              ] = `${verticalPadding}px ${horizontalPadding}px`;
            } else {
              // Other sizes remain as their own entries
              radioButtonConfig[`&.MuiRadio-size${Size}`] = {
                ...(width ? { width: `${width}px` } : {}),
                ...(height ? { height: `${height}px` } : {}),
                padding: `${verticalPadding}px ${horizontalPadding}px`,
              };
            }

            let color = "";
            if (paddingNode && "children" in paddingNode) {
              const hiddenNode = paddingNode.children.find(
                (node) => node.name === "_hidden"
              );
              if (hiddenNode && "children" in hiddenNode) {
                const vectorElement = hiddenNode.children.find((node) =>
                  node.name.includes("Vector")
                );
                if (
                  vectorElement &&
                  "fills" in vectorElement &&
                  Array.isArray(vectorElement.fills) &&
                  vectorElement.fills.length > 0
                ) {
                  const fillColor = vectorElement.fills[0];
                  if ("color" in fillColor && "opacity" in fillColor) {
                    color = rgbToHex({
                      ...fillColor.color,
                      a: fillColor.opacity,
                    });
                  }
                }
              }
            }

            let background = "";
            if (Array.isArray(ripple?.fills) && ripple?.fills.length > 0) {
              background = rgbToHex({
                ...ripple.fills[0].color,
                a: ripple.fills[0].opacity,
              });
            }

            const colorProperties = {
              color,
              background,
            };

            if (!radioButtonConfig[colorClass]) {
              radioButtonConfig[colorClass] = {};
            }

            if (!radioButtonConfig[colorClass][checkedClass]) {
              radioButtonConfig[colorClass][checkedClass] = {
                ...colorProperties,
                "&:hover": {},
                "&:focus": {},
                "&:active": {},
                "&.Mui-disabled": {},
              };
            }

            const stateColorProperties: Record<string, any> = {};
            if (State === "Hovered")
              stateColorProperties["&:hover"] = colorProperties;
            if (State === "Focused")
              stateColorProperties["&:focus"] = colorProperties;
            if (State === "Pressed")
              stateColorProperties["&:active"] = colorProperties;
            if (State === "Disabled")
              stateColorProperties["&.Mui-disabled"] = colorProperties;

            Object.assign(
              radioButtonConfig[colorClass][checkedClass],
              stateColorProperties
            );
          }
        }
      });
    }
  });

  return {
    MuiRadio: {
      styleOverrides: {
        root: radioButtonConfig,
      },
    },
  };
}
