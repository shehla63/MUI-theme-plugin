import { rgbToHex } from "../../utils";

export default function getInputLabels() {
  console.log("Fetching Input Labels...");

  const formsPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Forms"
  );

  if (!formsPage) {
    console.log("Forms page not found.");
    return {};
  }

  const inputLabelConfig: Record<string, any> = {};

  const inputLabelComponentSet = formsPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<InputLabel>"
  ) as ComponentSetNode;

  if (!inputLabelComponentSet) {
    console.log("InputLabel component set not found.");
    return {};
  }

  inputLabelComponentSet.children.forEach((labelVariant) => {
    if (labelVariant.type === "COMPONENT") {
      const variantProps = labelVariant.variantProperties;

      if (variantProps && "Color" in variantProps && "State" in variantProps) {
        const { Color, State } = variantProps;

        const labelElement = labelVariant.children.find(
          (node) => node.name === "Label"
        ) as TextNode;

        const { fontSize, fontName, fontWeight, letterSpacing } = labelElement;

        let fontFamily: string | undefined;
        let fontStyle: string | undefined;

        if (
          fontName &&
          typeof fontName === "object" &&
          "family" in fontName &&
          "style" in fontName
        ) {
          fontFamily = fontName.family;
          fontStyle = fontName.style;
        }

        const letterSpacingValue =
          letterSpacing &&
          typeof letterSpacing === "object" &&
          "value" in letterSpacing
            ? `${letterSpacing.value.toFixed(2)}px`
            : undefined;

        const fontSizeValue =
          typeof fontSize === "number" ? fontSize : undefined;
        const fontWeightValue =
          typeof fontWeight === "number" ? fontWeight : undefined;

        const colorClass = `&.MuiInputLabel-color${Color}`;
        const stateClass =
          State === "Disabled"
            ? "&.Mui-disabled"
            : State === "Error"
            ? "&.Mui-error"
            : null;

        let color = "";
        if (
          Array.isArray(labelElement.fills) &&
          labelElement.fills.length > 0
        ) {
          const fillColor = labelElement.fills[0];
          if ("color" in fillColor && "opacity" in fillColor) {
            color = rgbToHex({
              ...fillColor.color,
              a: fillColor.opacity,
            });
          }
        }

        const baseCss = {
          ...(fontSizeValue && { fontSize: fontSizeValue }),
          ...(fontFamily && { fontFamily }),
          ...(fontStyle && { fontStyle }),
          ...(fontWeightValue && { fontWeight: fontWeightValue }),
          ...(letterSpacingValue && { letterSpacing: letterSpacingValue }),
          ...(color && { color }),
        };

        // Initialize colorClass if it doesn't exist and set the base color
        if (!inputLabelConfig[colorClass]) {
          inputLabelConfig[colorClass] = { ...baseCss };
        }

        // Add state-specific color if applicable
        if (stateClass) {
          inputLabelConfig[colorClass][stateClass] = { ...baseCss };
        }
      }
    }
  });

  // Wrap inputLabelConfig in the specified structure for MUI theme overrides
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: inputLabelConfig,
      },
    },
  };
}
