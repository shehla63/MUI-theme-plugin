import { generateBoxShadowCSS, rgbToHex, styles } from "../../utils";

interface DialogTitleVariantConfig {
  [key: string]: {
    [key: string]: {
      [state: string]: any;
    };
  };
}

interface DialogTitleConfig {
  MuiDialogTitle: {
    styleOverrides: DialogTitleVariantConfig;
  };
}

export default function getDialogTitle() {
  console.log("Fetching Dialog Titles...");

  const dialogTitleConfig: DialogTitleConfig = {
    MuiDialogTitle: {
      styleOverrides: {},
    },
  };

  const dialogTitlePage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Dialog"
  );

  if (!dialogTitlePage) {
    return {};
  }

  const dialogTitleComponents = dialogTitlePage.findAll((node) =>
    node.name.includes("<DialogTitle>")
  );

  dialogTitleComponents.forEach((dialogTitleComponent) => {
    if (dialogTitleComponent.type === "COMPONENT") {
      // Assuming dialogTitleComponent has children, check for Typography component
      const typographyNode = (
        dialogTitleComponent.children as SceneNode[]
      ).find(
        (child) =>
          child.name.includes("Typography") && child.type === "INSTANCE"
      );
      let textCss = {};

      if (typographyNode && "children" in typographyNode) {
        // Now find the 'h6' text node inside Typography component
        const h6Node = (typographyNode.children as SceneNode[]).find(
          (child) => child.type === "TEXT" && child.name === "h6"
        );

        if (h6Node) {
          textCss = {
            ...styles.getFontFamilyCss(h6Node),
            ...styles.getFontSizeCss(h6Node),
            ...styles.getLetterSpacingCss(h6Node),
            ...styles.getFontWeightCss(h6Node),
            ...styles.getColorOrBackgroundCss(h6Node, "color"),
          };

          // Assign textCss to the styleOverrides for MuiDialogTitle
          dialogTitleConfig.MuiDialogTitle.styleOverrides["root"] = textCss;
        }
      }
    }
  });

  return dialogTitleConfig;
}
