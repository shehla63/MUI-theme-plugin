import { generateBoxShadowCSS, rgbToHex } from "../../utils";

interface TooltipConfig {
  MuiTooltip: {
    styleOverrides: {
      [key: string]: any;
    };
  };
}

export default function getTooltips() {
  console.log("Fetching Tooltips...");

  const tooltipsConfig: TooltipConfig = {
    MuiTooltip: {
      styleOverrides: {},
    },
  };

  const tooltipPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Tooltip"
  );

  if (!tooltipPage) {
    console.error("Tooltip page not found in Figma.");
    return {};
  }

  const tooltipComponents = tooltipPage.findAll((node) =>
    node.name.includes("<Tooltip>")
  );

  tooltipComponents.forEach((tooltipComponent) => {
    if (tooltipComponent.type === "COMPONENT_SET") {
      tooltipComponent.children.forEach((tooltipVariant) => {
        if (tooltipVariant.type === "COMPONENT") {
          const variantProps = tooltipVariant.variantProperties as any;

          if (variantProps?.Direction && variantProps.Direction === "None") {
            (tooltipVariant.children as readonly SceneNode[]).forEach(
              (variantChild) => {
                if (variantChild && variantChild.name === "Tooltip") {
                  const verticalPadding =
                    (variantChild as FrameNode).verticalPadding || 0;
                  const horizontalPadding =
                    (variantChild as FrameNode).horizontalPadding || 0;
                  const borderRadius =
                    (variantChild as FrameNode).cornerRadius || 0;
                  const fills = (variantChild as FrameNode).fills || [];
                  const opacity = (variantChild as FrameNode).opacity || 1;

                  let background = "";

                  // Extract background color from fills
                  if (Array.isArray(fills) && fills.length > 0) {
                    background = rgbToHex({
                      ...fills[0].color,
                      a: fills[0].opacity,
                    });
                  }

                  // Define the base CSS with background, padding, borderRadius, and opacity
                  const baseCss = {
                    padding: `${verticalPadding}px ${horizontalPadding}px`,
                    background,
                    borderRadius: `${String(borderRadius)}px`,
                    opacity,
                  };

                  // Apply the base CSS to the universal `.MuiTooltip-tooltip` class
                  tooltipsConfig.MuiTooltip.styleOverrides[
                    ".MuiTooltip-tooltip"
                  ] = {
                    ...baseCss,
                  };
                }
              }
            );
          }
        }
      });
    }
  });

  return tooltipsConfig;
}
