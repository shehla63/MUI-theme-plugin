import { styles } from "../../../utils";

interface TextfieldConfig {
  ".MuiInputLabel-outlined": {
    [key: string]: any; // Dynamic nested properties for sizeSelector and stateSelector
  };
}

export default function VariantOutlined() {
  console.log("Fetching TextField Label Outlined...");

  const textFieldConfig: TextfieldConfig = {
    ".MuiInputLabel-outlined": {},
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

        if (
          variantProps &&
          variantProps.Variant === "Outlined" &&
          variantProps.State !== "Hovered"
        ) {
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
            textFieldConfig[".MuiInputLabel-outlined"][sizeSelector] ||
            (textFieldConfig[".MuiInputLabel-outlined"][sizeSelector] = {});

          const shrinkConfig =
            sizeConfig[shrinkSelector] || (sizeConfig[shrinkSelector] = {});

          if (State === "Enabled") {
            // Add enabled state styles
            addEnabledStyles(textfieldVariant, shrinkConfig, hasValue, Size);
          } else {
            // Add styles for specific states (hover, focused, etc.)
            const stateSelector = getStateSelector(State);
            const stateConfig =
              shrinkConfig[stateSelector] || (shrinkConfig[stateSelector] = {});
            addStylesToState(textfieldVariant, stateConfig, hasValue, Size);
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
function addEnabledStyles(
  element: any,
  config: any,
  hasValue: string,
  size: string
) {
  const labelNode = findLabelNode(element, hasValue, size);

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
function addStylesToState(
  element: any,
  config: any,
  hasValue: string,
  size: string
) {
  const labelNode = findLabelNode(element, hasValue, size);

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
function findLabelNode(element: any, hasValue: string, size: string): any {
  if (hasValue === "False") {
    // Path: Main Node => Input => Content => Label
    const inputNode = element.children.find(
      (node: any) => node.name === "Input"
    );
    if (!inputNode) return null;

    const contentNode = inputNode.children.find(
      (node: any) => node.name === "Content"
    );
    if (!contentNode) return null;

    return contentNode.children.find((node: any) => node.name === "Label");
  }

  if (hasValue === "True") {
    if (size === "Medium") {
      // Path: Main Node => Label Container => Label
      const labelContainer = element.children.find(
        (node: any) => node.name === "Label Container"
      );
      if (!labelContainer) return null;

      return labelContainer.children.find((node: any) => node.name === "Label");
    }

    if (size === "Small") {
      // Path: Main Node => Input => Label Container => Label
      const inputNode = element.children.find(
        (node: any) => node.name === "Input"
      );
      if (!inputNode) return null;

      const labelContainer = inputNode.children.find(
        (node: any) => node.name === "Label Container"
      );
      if (!labelContainer) return null;

      return labelContainer.children.find((node: any) => node.name === "Label");
    }
  }

  return null;
}
