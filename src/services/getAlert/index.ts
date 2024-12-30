import { styles as STYLES } from "../../utils";

export default function getAlert() {
  console.log("Fetching Alert Components...");

  const alertPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Alert"
  );

  if (!alertPage) {
    console.log("Alert page not found.");
    return {};
  }

  const alertConfig: Record<string, any> = {
    root: {},
  };

  const allAlertComponents = alertPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Alert>"
  ) as ComponentSetNode[];

  allAlertComponents.forEach((alertComponentSet) => {
    alertComponentSet.children.forEach((alertVariant) => {
      if (alertVariant.type === "COMPONENT") {
        const variantProps = alertVariant.variantProperties;

        if (
          variantProps &&
          "Severity" in variantProps &&
          "Variant" in variantProps
        ) {
          const { Severity, Variant } = variantProps;

          const severitySelector = `&.MuiPaper-root&.MuiAlert-color${Severity}`;
          const variantSelector = `&.MuiAlert-${Variant.toLowerCase()}`;

          const severityConfig =
            alertConfig.root[severitySelector] ||
            (alertConfig.root[severitySelector] = {});

          const variantConfig =
            severityConfig[variantSelector] ||
            (severityConfig[variantSelector] = {});

          // Get styles for the alert
          const baseStyles = getAlertStyles(alertVariant);
          Object.assign(variantConfig, baseStyles);
        }
      }
    });
  });

  return {
    MuiAlert: {
      styleOverrides: alertConfig,
    },
  };
}

// Helper function to extract alert styles for the given variant
function getAlertStyles(element: any) {
  let styles: Record<string, any> = {};

  // Extract background styles directly from the main node
  styles = {
    ...STYLES.getColorOrBackgroundCss(element, "background"),
    ...STYLES.getPaddingCss(element),
    ...STYLES.getBorderRadiusCss(element),
  };

  // Extract icon container styles
  const iconContainer = element.children.find(
    (node: any) => node.name === "Icon Container"
  );
  if (iconContainer) {
    styles[".MuiAlert-icon"] = {
      ...STYLES.getPaddingCss(iconContainer),
      margin: "unset",
    };
  }

  // Extract title and description styles
  const textNode = element.children.find((node: any) => node.name === "Text");
  if (textNode) {
    const titleNode = textNode.children.find(
      (node: any) => node.name === "{Title}"
    );
    const descriptionNode = textNode.children.find(
      (node: any) => node.name === "Description"
    );

    if (titleNode) {
      styles[".MuiAlert-message"] = {
        ".MuiAlertTitle-root": {
          ...STYLES.getFontWeightCss(titleNode),
          ...STYLES.getFontSizeCss(titleNode),
          ...STYLES.getFontFamilyCss(titleNode),
          ...STYLES.getColorOrBackgroundCss(titleNode, "color"),
          ...STYLES.getLetterSpacingCss(titleNode),
        },
      };
    }

    if (descriptionNode) {
      Object.assign(styles[".MuiAlert-message"], {
        ...STYLES.getFontWeightCss(descriptionNode),
        ...STYLES.getFontSizeCss(descriptionNode),
        ...STYLES.getFontFamilyCss(descriptionNode),
        ...STYLES.getColorOrBackgroundCss(descriptionNode, "color"),
        ...STYLES.getLetterSpacingCss(descriptionNode),
        ...STYLES.getPaddingCss(textNode),
      });
    }
  }

  return styles;
}
