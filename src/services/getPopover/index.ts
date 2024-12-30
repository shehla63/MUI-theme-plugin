import { styles } from "../../utils";

export default function getPopover() {
  console.log("Fetching Popover");

  const popoverPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Popover"
  );

  if (!popoverPage) {
    console.log("Popover page not found.");
    return {};
  }

  const popoverConfig: Record<string, any> = {
    MuiPopover: {
      styleOverrides: {
        root: {
          "& .MuiPopover-paper": {
            // Styles for <Paper>
            "& .MuiTypography-root": {
              // Styles for <Typography>
            },
          },
        },
      },
    },
  };

  const popoverComponent = popoverPage.findOne(
    (node) => node.type === "COMPONENT" && node.name === "<Popover>"
  ) as ComponentNode;

  if (!popoverComponent) {
    console.log("<Popover> component not found.");
    return popoverConfig;
  }

  const paperNode = popoverComponent.children.find(
    (node) => node.name === "<Paper>"
  );

  if (paperNode) {
    // Get styles for <Paper>
    const paperStyles = {
      ...Object.fromEntries(
        Object.entries(
          styles.getColorOrBackgroundCss(paperNode, "background")
        ).map(([key, value]) => [key, `${value} !important`])
      ),
      ...Object.fromEntries(
        Object.entries(styles.getBorderRadiusCss(paperNode)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
      ...Object.fromEntries(
        Object.entries(styles.getBoxShadowCSS(paperNode)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
    };

    popoverConfig.MuiPopover.styleOverrides.root["& .MuiPopover-paper"] =
      paperStyles;

    // Find <Typography> inside <Paper>
    const typographyNode =
      "children" in paperNode &&
      paperNode.children.find((node) => node.name === "<Typography>");

    if (typographyNode) {
      const typographyStyles = {
        ...styles.getPaddingCss(typographyNode),
      };

      popoverConfig.MuiPopover.styleOverrides.root["& .MuiPopover-paper"][
        "& .MuiTypography-root"
      ] = typographyStyles;
    }
  }

  return popoverConfig;
}
