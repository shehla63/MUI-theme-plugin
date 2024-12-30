import { styles } from "../../../utils";

interface TextfieldConfig {
  "&.MuiInput-underline": {
    [key: string]: any; // Dynamic nested properties for different states
  };
}

export default function VariantStandard() {
  console.log("Fetching TextField Standard...");

  const textFieldConfig: TextfieldConfig = {
    "&.MuiInput-underline": {},
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
          variantProps.Variant === "Standard" &&
          variantProps["Has Value"] === "True"
        ) {
          const { Size, State } = variantProps;

          const sizeSelector =
            Size === "Small"
              ? `&.MuiInputBase-sizeSmall`
              : ":not(&.MuiInputBase-sizeSmall)";

          const rootConfig = textFieldConfig["&.MuiInput-underline"];

          const sizeConfig =
            rootConfig[sizeSelector] || (rootConfig[sizeSelector] = {});

          if (State === "Enabled") {
            processInputNode(textfieldVariant, sizeConfig);
          } else {
            const stateSelector = getStateSelector(State);
            const stateConfig =
              sizeConfig[stateSelector] || (sizeConfig[stateSelector] = {});
            processInputNode(textfieldVariant, stateConfig);
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

// Function to process Input node and its children
function processInputNode(element: any, config: any) {
  const inputNode = element.children.find((node: any) => node.name === "Input");
  if (!inputNode) return;

  // Process Content node
  const contentNode = inputNode.children.find(
    (node: any) => node.name === "Content"
  );
  if (contentNode) {
    const valueNode = contentNode.children.find(
      (node: any) => node.name === "Value"
    );

    if (valueNode) {
      const inputConfig = (config[".MuiInputBase-input"] = {});
      Object.assign(inputConfig, styles.getFontSizeCss(valueNode));
      Object.assign(inputConfig, styles.getLetterSpacingCss(valueNode));
      Object.assign(inputConfig, styles.getFontFamilyCss(valueNode));
      Object.assign(
        inputConfig,
        styles.getColorOrBackgroundCss(valueNode, "color")
      );
    }
  }

  // Process Underline node
  const underlineNode = inputNode.children.find(
    (node: any) => node.name === "Underline"
  );

  if (underlineNode) {
    const underlineBeforeConfig = (config["&:before"] = {});
    Object.assign(underlineBeforeConfig, {
      borderBottom: styles.getBordersCss(underlineNode, true).border,
    });

    const underlineHoverConfig = (config["&:hover:before"] = {});
    Object.assign(underlineHoverConfig, {
      borderBottom: styles.getBordersCss(underlineNode, true).border,
    });

    const underlineAfterConfig = (config["&:after"] = {});
    Object.assign(underlineAfterConfig, {
      borderBottom: styles.getBordersCss(underlineNode, true).border,
    });
  }
}
