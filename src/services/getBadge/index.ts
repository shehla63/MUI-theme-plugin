import { rgbToHex } from "../../utils";

// Define BadgeVariantConfig interface
interface BadgeVariantConfig {
  [key: string]: {
    [state: string]: any;
  };
}

interface BadgeConfig {
  MuiBadge: {
    styleOverrides: BadgeVariantConfig;
  };
}

export default function getBadges() {
  console.log("Fetching Badges...");

  const badgesConfig: BadgeConfig = {
    MuiBadge: {
      styleOverrides: {
        root: {},
      },
    },
  };

  const badgePage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Badge"
  );

  if (!badgePage) {
    return {};
  }

  const badgeComponents = badgePage.findAll((node) => {
    return node.name === "<Badge>";
  }) as ComponentSetNode[];
  badgeComponents.forEach((badgeComponentSet) => {
    if (badgeComponentSet.type === "COMPONENT_SET") {
      badgeComponentSet.children.forEach((badgeVariant) => {
        if (badgeVariant.type === "COMPONENT") {
          const variantProps = badgeVariant.variantProperties;
          let backgroundColor = "",
            horizontalPadding,
            verticalPadding;
          const variantKey = variantProps && variantProps.Variant.toLowerCase();
          const colorKey = variantProps && variantProps.Color;
          if (
            badgeVariant &&
            "fills" in badgeVariant &&
            Array.isArray(badgeVariant.fills) &&
            badgeVariant.fills.length > 0
          ) {
            const fill = badgeVariant.fills[0];
            if (fill && fill.color) {
              backgroundColor = rgbToHex({
                ...fill.color,
                a: fill.opacity,
              });
            }
          }
          verticalPadding = badgeVariant.verticalPadding;
          horizontalPadding = badgeVariant.horizontalPadding;
          const selector = `& .MuiBadge-color${colorKey}`;
          const badgeTypeSelector = `&.MuiBadge-${variantKey}.MuiBadge-badge`;

          if (!badgesConfig.MuiBadge.styleOverrides.root[selector]) {
            badgesConfig.MuiBadge.styleOverrides.root[selector] = {};
          }

          badgesConfig.MuiBadge.styleOverrides.root[selector][
            badgeTypeSelector
          ] = {
            backgroundColor,
            padding: `${verticalPadding}px ${horizontalPadding}px`,
          };
        }
      });
    }
  });

  return badgesConfig;
}
