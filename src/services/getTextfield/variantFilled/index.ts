import { styles } from "../../../utils";

interface TextfieldConfig {
  "&.MuiFilledInput-root": {
    [key: string]: any; // Dynamic nested properties for different states
  };
}

export default function VariantFilled() {
  console.log("Fetching TextField Filled...");

  const textFieldConfig: TextfieldConfig = {
    "&.MuiFilledInput-root": {}, // All extracted styles will be added here
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
          variantProps.Variant === "Filled" &&
          variantProps["Has Value"] === "True"
        ) {
          const { Size, State } = variantProps;

          const sizeSelector =
            Size === "Small"
              ? `&.MuiInputBase-sizeSmall`
              : ":not(&.MuiInputBase-sizeSmall)";

          const rootConfig = textFieldConfig["&.MuiFilledInput-root"];

          const sizeConfig =
            rootConfig[sizeSelector] || (rootConfig[sizeSelector] = {});

          if (State === "Enabled") {
            processFilledNode(
              textfieldComponentSet,
              textfieldVariant,
              sizeConfig
            );
          } else {
            const stateSelector = getStateSelector(State);
            const stateConfig =
              sizeConfig[stateSelector] || (sizeConfig[stateSelector] = {});
            processFilledNode(
              textfieldComponentSet,
              textfieldVariant,
              stateConfig
            );
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

// Function to fetch padding from the `Has Value: False` variant
function getPaddingFromHasValueFalse(
  textfieldComponentSet: any,
  textfieldVariant: any
): { [key: string]: string } {
  const noValueVariant = textfieldComponentSet.children.find((variant: any) => {
    const variantProps = variant.variantProperties || {};
    // Match all variant properties except `Has Value`
    return (
      Object.entries(textfieldVariant.variantProperties).every(
        ([key, value]) => key === "Has Value" || variantProps[key] === value
      ) && variantProps["Has Value"] === "False"
    );
  });

  if (noValueVariant) {
    // Find the Content node in noValueVariant
    const contentNode = noValueVariant.children.find(
      (node: any) => node.name === "Content"
    );

    if (contentNode) {
      // Find the Input node inside the Content node
      const noValueInputNode = contentNode.children.find(
        (node: any) => node.name === "Input"
      );

      if (noValueInputNode) {
        // Extract and return padding from the Input node
        return styles.getPaddingCss(noValueInputNode);
      }
    }
  }

  return {}; // Return empty object if no match is found
}

// Function to process Content node and its children
function processFilledNode(
  textfieldComponentSet: any,
  textfieldVariant: any,
  config: any
) {
  const contentNode = textfieldVariant.children.find(
    (node: any) => node.name === "Content"
  );
  if (!contentNode) return;

  // Get background from Content node
  const backgroundConfig = styles.getColorOrBackgroundCss(
    contentNode,
    "background"
  );
  Object.assign(config, backgroundConfig);

  // Get border radius from Content node
  const borderRadiusConfig = styles.getBorderRadiusCss(contentNode);
  Object.assign(config, borderRadiusConfig);

  // Process Input node inside Content
  const inputNode = contentNode.children.find(
    (node: any) => node.name === "Input"
  );
  if (inputNode) {
    // Process Content node inside Input
    const innerContentNode = inputNode.children.find(
      (node: any) => node.name === "Content"
    );
    if (innerContentNode) {
      const valueNode = innerContentNode.children.find(
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

        // Get padding from `Has Value: False` variant
        const noValuePadding = getPaddingFromHasValueFalse(
          textfieldComponentSet,
          textfieldVariant
        );
        Object.assign(inputConfig, noValuePadding);
      }
    }
  }

  // Process Underline node
  const underlineNode = contentNode.children.find(
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
