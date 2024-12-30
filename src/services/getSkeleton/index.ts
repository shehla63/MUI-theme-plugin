import { styles } from "../../utils";

export default function getSkeleton() {
  console.log("Fetching Skeleton...");

  const skeletonPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Skeleton"
  );

  if (!skeletonPage) {
    console.log("Skeleton page not found.");
    return {};
  }

  const skeletonPageComponent = skeletonPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Skeleton>"
  ) as ComponentSetNode;

  if (!skeletonPageComponent) {
    console.log("Skeleton component set not found.");
    return {};
  }

  const skeletonConfig: Record<string, any> = {
    MuiSkeleton: {
      styleOverrides: {
        root: {
          "&.MuiSkeleton-text": {},
          "&.MuiSkeleton-circular": {},
          "&.MuiSkeleton-rectangular": {},
        },
      },
    },
  };

  skeletonPageComponent.children.forEach((skeletonVariant) => {
    if (skeletonVariant.type === "COMPONENT") {
      const variantProps = skeletonVariant.variantProperties;

      if (variantProps && "Shape" in variantProps) {
        const { Shape } = variantProps;

        const shapeKey =
          Shape === "Text"
            ? "&.MuiSkeleton-text"
            : Shape === "Circle"
            ? "&.MuiSkeleton-circular"
            : "&.MuiSkeleton-rectangular";

        const backgroundStyles = styles.getColorOrBackgroundCss(
          skeletonVariant,
          "background"
        );

        const borderRadiusStyles = styles.getBorderRadiusCss(skeletonVariant);

        // Combine the styles for the shape variant
        skeletonConfig.MuiSkeleton.styleOverrides.root[shapeKey] = {
          ...backgroundStyles,
          ...borderRadiusStyles,
        };
      }
    }
  });

  return skeletonConfig;
}
