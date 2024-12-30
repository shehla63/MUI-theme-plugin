import { styles } from "../../utils";

export default function getSnackbar() {
  console.log("Fetching Snackbar");

  const snackbarPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Snackbar"
  );

  if (!snackbarPage) {
    console.log("Snackbar page not found.");
    return {};
  }

  const snackbarComponent = snackbarPage.findOne(
    (node) => node.type === "COMPONENT" && node.name === "<Snackbar>"
  );

  if (!snackbarComponent) {
    console.log("Snackbar component not found.");
    return {};
  } else if (!("children" in snackbarComponent)) {
    console.log("Snackbar component does not have children.");
    return {};
  }

  const paperNode = snackbarComponent.children.find(
    (node: any) => node.name === "<Paper>"
  );

  if (!paperNode || !("children" in paperNode)) {
    console.log("Paper node does not have children.");
    return {};
  }

  const snackbarContentNode = paperNode.children.find(
    (node: any) => node.name === "<SnackbarContent>"
  );

  return {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            ...Object.fromEntries(
              Object.entries(
                styles.getColorOrBackgroundCss(paperNode, "backgroundColor")
              ).map(([key, value]) => [key, `${value} !important`])
            ),
            ...Object.fromEntries(
              Object.entries(styles.getBoxShadowCSS(paperNode)).map(
                ([key, value]) => [key, `${value} !important`]
              )
            ),
            ...Object.fromEntries(
              Object.entries(styles.getBorderRadiusCss(paperNode)).map(
                ([key, value]) => [key, `${value} !important`]
              )
            ),
            ...Object.fromEntries(
              Object.entries(styles.getPaddingCss(snackbarContentNode)).map(
                ([key, value]) => [key, `${value} !important`]
              )
            ),
          },
        },
      },
    },
  };
}
