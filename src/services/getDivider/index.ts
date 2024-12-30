import { styles } from "../../utils";

export default function getDivider() {
  const dividerPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Divider"
  );

  if (!dividerPage) {
    console.log("Divider page not found.");
    return {};
  }

  const dividerConfig: Record<string, any> = {
    root: {},
  };

  // Find horizontal divider component
  const horizontalDividerComponent = dividerPage.findOne((node) =>
    node.name.includes("<Divider> | Horizontal")
  );

  let horizontalBorder = null;
  if (horizontalDividerComponent && "children" in horizontalDividerComponent) {
    const horizontalLineNode = horizontalDividerComponent?.findChild(
      (node: any) => node.name === "Divider"
    );

    horizontalBorder = styles.getBordersCss(horizontalLineNode, true).border;
  } else {
    console.log("Horizontal divider layer not found.");
  }

  // Find vertical divider component
  const verticalDividerComponent = dividerPage.findOne((node) =>
    node.name.includes("<Divider> | Vertical")
  );

  let verticalBorder = null;
  if (verticalDividerComponent && "children" in verticalDividerComponent) {
    const verticalLineNode = verticalDividerComponent?.findChild(
      (node: any) => node.name === "Divider"
    );

    verticalBorder = styles.getBordersCss(verticalLineNode, true).border;
  } else {
    console.log("Vertical divider layer not found.");
  }

  return {
    MuiDivider: {
      styleOverrides: {
        root: {
          ...(horizontalBorder && { borderBottom: horizontalBorder }),
          "&.MuiDivider-vertical": {
            ...(verticalBorder && { borderRight: verticalBorder }),
          },
        },
      },
    },
  };
}
