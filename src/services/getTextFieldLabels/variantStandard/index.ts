import { styles } from "../../../utils";

interface TextfieldConfig {
  ".MuiInputLabel-standard": {
    [key: string]: any; // Dynamic nested properties for sizeSelector and stateSelector
  };
}

export default function VariantStandard() {
  console.log("Fetching TextField Label Standard...");

  const textFieldConfig: TextfieldConfig = {
    ".MuiInputLabel-standard": {},
  };

  const textfieldPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Text Field"
  );

  if (!textfieldPage) {
    console.log("TextField page not found.");
    return {};
  }

  const allTextFieldComponents = textfieldPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<TextField>"
  ) as ComponentSetNode[];

  allTextFieldComponents.forEach((textfieldComponentSet) => {
    textfieldComponentSet.children.forEach((textfieldVariant) => {
      if (textfieldVariant.type === "COMPONENT") {
        const variantProps = textfieldVariant.variantProperties;

        if (variantProps && variantProps.Variant === "Standard") {
          const { Size, State, "Has Value": hasValue } = variantProps;

          const sizeSelector =
            Size === "Small"
              ? "&.MuiInputLabel-sizeSmall"
              : ":not(&.MuiInputLabel-sizeSmall)";

          const shrinkSelector =
            hasValue === "True"
              ? "&.MuiInputLabel-shrink"
              : ":not(&.MuiInputLabel-shrink)";

          const sizeConfig =
            textFieldConfig[".MuiInputLabel-standard"][sizeSelector] ||
            (textFieldConfig[".MuiInputLabel-standard"][sizeSelector] = {});

          const shrinkConfig =
            sizeConfig[shrinkSelector] || (sizeConfig[shrinkSelector] = {});

          if (State === "Enabled") {
            // Add enabled state styles
            addEnabledStyles(textfieldVariant, shrinkConfig, hasValue);
          } else {
            // Add styles for specific states (hover, focused, etc.)
            const stateSelector = getStateSelector(State);
            const stateConfig =
              shrinkConfig[stateSelector] || (shrinkConfig[stateSelector] = {});
            addStylesToState(textfieldVariant, stateConfig, hasValue);
          }
        }
      }
    });
  });

  return textFieldConfig;
}

// Function to map state to selector
function getStateSelector(state: string): string {
  switch (state) {
    case "Hovered":
      return ":hover";
    case "Focused":
      return "&.Mui-focused:not(&.Mui-error)";
    case "Disabled":
      return "&.Mui-disabled";
    case "Error":
      return "&.Mui-error";
    default:
      return "";
  }
}

// Function to add enabled styles directly
function addEnabledStyles(element: any, config: any, hasValue: string) {
  const labelNode = findLabelNode(element, hasValue);

  if (!labelNode) return;

  Object.assign(config, {
    ...styles.getFontSizeCss(labelNode),
    ...styles.getFontWeightCss(labelNode),
    ...styles.getLetterSpacingCss(labelNode),
    ...styles.getFontFamilyCss(labelNode),
    ...styles.getColorOrBackgroundCss(labelNode, "color"),
  });
}

// Function to add styles for specific states (hover, focused, etc.)
function addStylesToState(element: any, config: any, hasValue: string) {
  const labelNode = findLabelNode(element, hasValue);

  if (!labelNode) return;

  Object.assign(config, {
    ...styles.getFontSizeCss(labelNode),
    ...styles.getFontWeightCss(labelNode),
    ...styles.getLetterSpacingCss(labelNode),
    ...styles.getFontFamilyCss(labelNode),
    ...styles.getColorOrBackgroundCss(labelNode, "color"),
  });
}

// Helper function to find the label node
function findLabelNode(element: any, hasValue: string): any {
  const inputNode = element.children.find((node: any) => node.name === "Input");
  if (!inputNode) return null;

  if (hasValue === "True") {
    // Path: Main Node => Input => Label
    const labelNode = inputNode.children.find(
      (node: any) => node.name === "Label"
    );
    return labelNode;
  } else {
    // Path: Main Node => Input => Input => Label
    const nestedInputNode = inputNode.children.find(
      (node: any) => node.name === "Input"
    );
    if (!nestedInputNode) return null;

    const labelNode = nestedInputNode.children.find(
      (node: any) => node.name === "Label"
    );
    return labelNode;
  }
}
