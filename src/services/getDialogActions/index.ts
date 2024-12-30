import { rgbToHex, styles } from "../../utils";

interface DialogActionsVariantConfig {
  [key: string]: any;
}

interface DialogActionsConfig {
  MuiDialogActions: {
    styleOverrides: DialogActionsVariantConfig;
  };
}

export default function getDialogActions(): DialogActionsConfig {
  console.log("Fetching Dialog Actions...");

  const dialogActionsConfig: DialogActionsConfig = {
    MuiDialogActions: {
      styleOverrides: {},
    },
  };

  // Find the "Dialog" page in Figma
  const dialogActionsPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Dialog"
  ) as PageNode | undefined;

  if (!dialogActionsPage) {
    console.log("Dialog page not found.");
    return dialogActionsConfig;
  }

  // Find the "DialogActions" frame within the "Dialog" page
  const dialogActionsFrame = dialogActionsPage.findOne(
    (node) => node.type === "FRAME" && node.name.trim() === "DialogActions"
  ) as FrameNode | undefined;

  if (!dialogActionsFrame) {
    console.log("DialogActions frame not found.");
    return dialogActionsConfig;
  }

  // Locate all "<DialogActions>" components within the "DialogActions" frame
  const dialogActionsComponents = dialogActionsFrame.findAll(
    (node) => node.name === "<DialogActions>"
  ) as SceneNode[];

  dialogActionsComponents.forEach((dialogActionsComponentSet) => {
    if (dialogActionsComponentSet.type === "COMPONENT_SET") {
      (dialogActionsComponentSet as ComponentSetNode).children.forEach(
        (dialogActionsComponent) => {
          if (
            dialogActionsComponent.type === "COMPONENT" &&
            dialogActionsComponent.name === "Actions=1"
          ) {
            // Find "Action #1" inside "Actions=1"
            const actionVariant = (
              dialogActionsComponent as ComponentNode
            ).findOne(
              (node) =>
                node.name.trim() === "Action #1" && node.type === "INSTANCE"
            ) as FrameNode | undefined;

            if (actionVariant) {
              const actionComponent = actionVariant.findOne(
                (node) => node.name.trim() === "Base" && node.type === "FRAME"
              ) as FrameNode | undefined;

              if (actionComponent) {
                const buttonComponent = actionComponent.findChild(
                  (node) =>
                    node.name.trim() === "Button" && node.type === "TEXT"
                ) as TextNode | undefined;

                if (buttonComponent) {
                  // Extract the text color using styles.getColorOrBackgroundCss
                  const textColor = styles.getColorOrBackgroundCss(
                    buttonComponent,
                    "color"
                  );

                  // Apply the extracted text color to MuiDialogActions styleOverrides
                  dialogActionsConfig.MuiDialogActions.styleOverrides["root"] =
                    {
                      "& .MuiDialogActions-text": {
                        color: textColor,
                      },
                    };
                }
              }
            }
          }
        }
      );
    }
  });

  return dialogActionsConfig;
}
