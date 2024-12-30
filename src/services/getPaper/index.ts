import { styles } from "../../utils";

export default function getPaper() {
  console.log("Fetching Paper...");

  const paperPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Paper"
  );

  if (!paperPage) {
    console.log("Paper page not found.");
    return {};
  }

  const paperPageComponent = paperPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Paper>"
  ) as ComponentSetNode;

  if (!paperPageComponent) {
    console.log("Paper component set not found.");
    return {};
  }

  const paperConfig: Record<string, any> = {
    MuiPaper: {
      styleOverrides: {
        root: {
          "&.MuiPaper-elevation": {},
          "&.MuiPaper-outlined": {},
        },
      },
    },
  };

  paperPageComponent.children.forEach((paperVariant) => {
    if (paperVariant.type === "COMPONENT") {
      const variantProps = paperVariant.variantProperties;

      if (
        variantProps &&
        "Variant" in variantProps &&
        "Elevation" in variantProps &&
        "Square" in variantProps
      ) {
        const { Variant, Elevation, Square } = variantProps;

        const variantKey =
          Variant === "Elevation"
            ? "&.MuiPaper-elevation"
            : "&.MuiPaper-outlined";
        const elevationKey = `&.MuiPaper-elevation${Elevation}`;
        const squareKey =
          Square === "True" ? ":not(&.MuiPaper-rounded)" : "&.MuiPaper-rounded";

        const targetConfig =
          paperConfig.MuiPaper.styleOverrides.root[variantKey];
        targetConfig[elevationKey] = targetConfig[elevationKey] || {};
        targetConfig[elevationKey][squareKey] =
          targetConfig[elevationKey][squareKey] || {};

        // Extract the required styles
        const borderRadius = styles.getBorderRadiusCss(paperVariant);
        const background = styles.getColorOrBackgroundCss(
          paperVariant,
          "background"
        );
        const border = styles.getBordersCss(paperVariant);
        const padding = styles.getPaddingCss(paperVariant);
        const boxShadow = styles.getBoxShadowCSS(paperVariant);

        // Apply styles to the specific elevation and square variant
        Object.assign(targetConfig[elevationKey][squareKey], {
          ...borderRadius,
          ...background,
          ...border,
          ...padding,
          ...boxShadow,
        });
      }
    }
  });

  return paperConfig;
}
