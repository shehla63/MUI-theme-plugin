import { styles } from "../../utils";

const getCssForFab = (fabNode: any) => {
  const baseNode = fabNode.findChild((node: any) => node.name === "Base");

  return {
    ...styles.getColorOrBackgroundCss(fabNode, "background"),
    ...styles.getWidthCss(fabNode),
    ...styles.getHeightCss(fabNode),
    ...styles.getBoxShadowCSS(fabNode),
    ...styles.getPaddingCss(baseNode),
    ...styles.getBordersCss(baseNode),
  };
};

const getCssForSpeedDialItem = (speedDialItemNode: any) => {
  const fabNode = speedDialItemNode.findChild(
    (node: any) => node.name === "<Fab>"
  );
  const baseNode = fabNode.findChild((node: any) => node.name === "Base");

  return {
    ...styles.getColorOrBackgroundCss(fabNode, "background"),
    ...styles.getWidthCss(fabNode),
    ...styles.getHeightCss(fabNode),
    ...styles.getBoxShadowCSS(fabNode),
    ...styles.getPaddingCss(baseNode),
    ...styles.getBordersCss(baseNode),
  };
};

export default function getSpeedDial() {
  console.log("Fetching Speed Dial...");
  const speedDialPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Speed Dial"
  );

  if (!speedDialPage) {
    console.log("Speed Dial page not found.");
    return {};
  }

  const speedDialAllComponents = speedDialPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<SpeedDial>"
  ) as ComponentSetNode;

  const singleComponent = speedDialAllComponents.findChild(
    (node) => node.name === "Direction=Up"
  ) as ComponentNode;

  const fabNode = singleComponent.findChild((node) => node.name === "<Fab>");
  const speedDialItemNode = singleComponent.findChild(
    (node) => node.name === "<SpeedDialItem>"
  );

  return {
    MuiSpeedDial: {
      styleOverrides: {
        root: {
          ".MuiSpeedDial-fab": {
            ...getCssForFab(fabNode),
          },
          ".MuiSpeedDialAction-fab": {
            ...getCssForSpeedDialItem(speedDialItemNode),
          },
        },
      },
    },
  };
}
