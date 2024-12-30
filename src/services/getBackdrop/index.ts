import { styles } from "../../utils";

export default function getBackdrop() {
  console.log("Fetching Backkdrop...");

  const backdropPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Backdrop"
  );

  if (!backdropPage) {
    console.log("Backdrop page not found.");
    return {};
  }

  const backdropPageComponent = backdropPage.findOne(
    (node) => node.name.includes("Backdrop") && node.type === "COMPONENT"
  ) as ComponentNode;

  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          ...styles.getColorOrBackgroundCss(
            backdropPageComponent,
            "backgroundColor"
          ),
        },
      },
    },
  };
}
