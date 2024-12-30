import { styles } from "../../../utils";

interface TextfieldConfig {
  [key: string]: any; // Directly map to selectors
}

export default function VariantOutlined() {
  console.log("Fetching TextField Outlined...");

  const textFieldConfig: TextfieldConfig = {
    "&.MuiOutlinedInput-root": {}, // Consolidated structure
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
          variantProps["Has Value"] === "True"
        ) {
          const { Size, State } = variantProps;

          const sizeSelector =
            Size === "Small"
              ? `&.MuiInputBase-sizeSmall`
              : ":not(&.MuiInputBase-sizeSmall)";

          const rootConfig = textFieldConfig["&.MuiOutlinedInput-root"];
          const sizeConfig =
            rootConfig[sizeSelector] || (rootConfig[sizeSelector] = {});

          if (State === "Enabled") {
            // Add default styles directly under the size class
            addDefaultStylesToSize(textfieldVariant, sizeConfig);
          } else {
            // Add styles for specific states (error, hover, etc.)
            const stateSelector = getStateSelector(State);
            const stateConfig =
              sizeConfig[stateSelector] || (sizeConfig[stateSelector] = {});
            addStylesToState(textfieldVariant, stateConfig);
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
      return "&:hover:not(.Mui-error):not(.Mui-focused):not(.Mui-disabled)";
    case "Error":
      return "&.Mui-error";
    case "Disabled":
      return "&.Mui-disabled";
    case "Focused":
      return "&.Mui-focused:not(&.Mui-error)";
    default:
      return "";
  }
}

// Function to add default (enabled) styles directly under the size class
function addDefaultStylesToSize(element: any, config: any) {
  const inputNode = element.children.find((node: any) => node.name === "Input");

  if (!inputNode) return;

  const inputConfig = (config[".MuiInputBase-input"] = {});
  Object.assign(inputConfig, styles.getPaddingCss(inputNode));

  const fieldsetConfig = (config[".MuiOutlinedInput-notchedOutline"] = {});
  Object.assign(fieldsetConfig, styles.getBorderRadiusCss(inputNode));
  Object.assign(fieldsetConfig, styles.getBordersCss(inputNode));

  const contentNode = inputNode.children.find(
    (node: any) => node.name === "Content"
  );

  if (contentNode) {
    const valueNode = contentNode.children.find(
      (node: any) => node.name === "Value"
    );

    if (valueNode) {
      Object.assign(inputConfig, {
        ...styles.getFontSizeCss(valueNode),
        ...styles.getLetterSpacingCss(valueNode),
        ...styles.getFontFamilyCss(valueNode),
        ...styles.getColorOrBackgroundCss(valueNode, "color"),
      });
    }

    Object.assign(fieldsetConfig, styles.getPaddingCss(contentNode));
  }
}

// Function to add styles for specific states (error, hover, etc.)
function addStylesToState(element: any, config: any) {
  const inputNode = element.children.find((node: any) => node.name === "Input");

  if (!inputNode) return;

  const inputConfig = (config[".MuiInputBase-input"] = {});
  Object.assign(inputConfig, styles.getPaddingCss(inputNode));

  const fieldsetConfig = (config[".MuiOutlinedInput-notchedOutline"] = {});
  Object.assign(fieldsetConfig, styles.getBorderRadiusCss(inputNode));
  Object.assign(fieldsetConfig, styles.getBordersCss(inputNode));

  const contentNode = inputNode.children.find(
    (node: any) => node.name === "Content"
  );

  if (contentNode) {
    const valueNode = contentNode.children.find(
      (node: any) => node.name === "Value"
    );

    if (valueNode) {
      Object.assign(inputConfig, {
        ...styles.getFontSizeCss(valueNode),
        ...styles.getLetterSpacingCss(valueNode),
        ...styles.getFontFamilyCss(valueNode),
        ...styles.getColorOrBackgroundCss(valueNode, "color"),
      });
    }

    Object.assign(fieldsetConfig, styles.getPaddingCss(contentNode));
  }
}
