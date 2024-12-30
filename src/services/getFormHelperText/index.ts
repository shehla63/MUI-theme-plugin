import { rgbToHex } from "../../utils";

// Helper function to get color from TextNode fills
const getColorFromFills = (
  labelElement: TextNode
): {
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: number;
  letterSpacing?: string;
  color?: string;
} => {
  let color = "";

  // Check if fills exist and retrieve the color if available
  if (Array.isArray(labelElement.fills) && labelElement.fills.length > 0) {
    const fillColor = labelElement.fills[0];
    if ("color" in fillColor && "opacity" in fillColor) {
      color = rgbToHex({
        ...fillColor.color,
        a: fillColor.opacity,
      });
    }
  }

  const { fontSize, fontName, fontWeight, letterSpacing } = labelElement;

  // Ensure fontName is of the right type with properties family and style
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

  // Check that letterSpacing has a `value` property before using it
  const letterSpacingValue =
    letterSpacing &&
    typeof letterSpacing === "object" &&
    "value" in letterSpacing
      ? `${letterSpacing.value.toFixed(2)}px`
      : undefined;

  // Explicitly cast fontSize and fontWeight to `number | undefined`
  const fontSizeValue = typeof fontSize === "number" ? fontSize : undefined;
  const fontWeightValue =
    typeof fontWeight === "number" ? fontWeight : undefined;

  // Return the resulting object
  return {
    ...(fontSizeValue && { fontSize: fontSizeValue }),
    ...(fontFamily && { fontFamily }),
    ...(fontStyle && { fontStyle }),
    ...(fontWeightValue && { fontWeight: fontWeightValue }),
    ...(letterSpacingValue && { letterSpacing: letterSpacingValue }),
    ...(color && { color }),
  };
};

export default function getFormHelperText() {
  console.log("Fetching Form Helper Text...");

  const formsPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Forms"
  ) as FrameNode | undefined;

  if (!formsPage) {
    console.log("Forms page not found.");
    return {};
  }

  const formHelperTextConfig: Record<string, { color?: string }> = {};

  const formHelperTextComponentSet = formsPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<FormHelperText>"
  ) as ComponentSetNode | null;

  if (!formHelperTextComponentSet) {
    console.log("FormHelperText component set not found.");
    return {};
  }

  // Iterate through the formHelperTextComponentSet children to extract state variants dynamically
  formHelperTextComponentSet.children.forEach((variant) => {
    if (variant.type === "COMPONENT" && variant.variantProperties) {
      const state = variant.variantProperties["Disabled"];

      // Map state names to the desired MUI format
      const stateClass =
        state === "Disabled"
          ? "&.Mui-disabled"
          : state === "Error"
          ? "&.Mui-error"
          : "&:not(.Mui-disabled)";

      const labelElement = variant.children.find(
        (node) => node.name === "Helper text"
      ) as TextNode | undefined;

      if (labelElement) {
        const css = getColorFromFills(labelElement);

        // Initialize state class in formHelperTextConfig if it doesn't exist
        if (!formHelperTextConfig[stateClass]) {
          formHelperTextConfig[stateClass] = {};
        }

        // Set the color for the current state
        formHelperTextConfig[stateClass] = { ...css };
      }
    }
  });

  // Wrap formHelperTextConfig in the specified structure for MUI theme overrides
  return {
    MuiFormHelperText: {
      styleOverrides: {
        root: formHelperTextConfig,
      },
    },
  };
}
