import { rgbToHex, styles } from "../../utils";

interface DialogContentVariantConfig {
  [key: string]: any;
}

interface DialogContentConfig {
  MuiDialogContent: {
    styleOverrides: DialogContentVariantConfig;
  };
}

export default function getDialogContent(): DialogContentConfig {
  console.log("Fetching Dialog Contents...");

  const dialogContentConfig: DialogContentConfig = {
    MuiDialogContent: {
      styleOverrides: {},
    },
  };

  const dialogContentPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Dialog"
  ) as PageNode | undefined;

  if (!dialogContentPage) {
    console.log("Dialog page not found.");
    return dialogContentConfig;
  }

  const dialogContentFrame = dialogContentPage.findOne(
    (node) => node.type === "FRAME" && node.name.trim() === "DialogContent"
  ) as FrameNode | undefined;

  if (!dialogContentFrame) {
    console.log("DialogContent frame not found.");
    return dialogContentConfig;
  }

  const dialogContentComponents = dialogContentFrame.findAll(
    (node) => node.name === "<DialogContent>"
  ) as SceneNode[];

  dialogContentComponents.forEach((dialogContentComponentSet: SceneNode) => {
    if (dialogContentComponentSet.type === "COMPONENT_SET") {
      (dialogContentComponentSet as ComponentSetNode).children.forEach(
        (dialogContentComponent: SceneNode) => {
          if (dialogContentComponent.type === "COMPONENT") {
            const variantProps = (dialogContentComponent as ComponentNode)
              .variantProperties;
            const dividers = variantProps?.["Dividers?"] === "True";
            const { strokes, dashPattern } = dialogContentComponent;

            let borderTopColor = "",
              borderBottomColor = "",
              paddingVertical = "",
              paddingHorizontal = "",
              borderTopLeftRadius = "",
              borderTopRightRadius = "",
              borderBottomLeftRadius = "",
              borderBottomRightRadius = "",
              borderStyle = "";

            // Extract Divider-Specific Color
            if (dividers) {
              if (Array.isArray(strokes) && strokes.length > 0) {
                const stroke = rgbToHex({
                  ...strokes[0].color,
                  a: strokes[0].opacity,
                });
                borderBottomColor = stroke;
                borderTopColor = stroke;
              }
            }
            if (dashPattern.length > 0) {
              borderStyle = "dashed";
            } else {
              borderStyle = "solid";
            }

            // Extract Padding Values
            const paddingCss = styles.getPaddingCss(
              dialogContentComponent as ComponentNode
            );
            if (paddingCss) {
              paddingVertical =
                paddingCss.paddingTop || paddingCss.paddingBottom || "";
              paddingHorizontal =
                paddingCss.paddingLeft || paddingCss.paddingRight || "";
            }

            // Extract Border Radius Values
            const radiusCss = styles.getBorderRadiusCss(
              dialogContentComponent as ComponentNode
            );
            borderTopLeftRadius = radiusCss.borderTopLeftRadius || "";
            borderTopRightRadius = radiusCss.borderTopRightRadius || "";
            borderBottomLeftRadius = radiusCss.borderBottomLeftRadius || "";
            borderBottomRightRadius = radiusCss.borderBottomRightRadius || "";

            const baseCss = {
              ...(paddingVertical || paddingHorizontal
                ? { padding: `${paddingVertical} ${paddingHorizontal}` }
                : {}),
              ...(borderTopLeftRadius ? { borderTopLeftRadius } : {}),
              ...(borderTopRightRadius ? { borderTopRightRadius } : {}),
              ...(borderBottomLeftRadius ? { borderBottomLeftRadius } : {}),
              ...(borderBottomRightRadius ? { borderBottomRightRadius } : {}),
              // ...(borderStyle ? { borderStyle } : ""),
            };

            if (dividers) {
              dialogContentConfig.MuiDialogContent.styleOverrides[
                "&.MuiDialogContent-dividers"
              ] = {
                borderTopColor: borderTopColor,
                borderBottomColor: borderBottomColor,
              };
            }

            // Apply base styles to root
            dialogContentConfig.MuiDialogContent.styleOverrides["root"] = {
              ...baseCss,
            };
          }
        }
      );
    }
  });

  return dialogContentConfig;
}
