import { styles } from "../../utils";

export default function getIcons() {
  console.log("Fetching Icons...");

  const iconsPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Icons"
  );

  if (!iconsPage) {
    console.log("Icons page not found.");
    return {};
  }

  const iconsConfig: Record<string, any> = {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          "&.MuiSvgIcon-fontSizeInherit": {},
          "&.MuiSvgIcon-fontSizeSmall": {},
          "&.MuiSvgIcon-fontSizeMedium": {},
          "&.MuiSvgIcon-fontSizeLarge": {},
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          "&.material-icons": {
            "&.MuiIcon-fontSizeInherit": {},
            "&.MuiIcon-fontSizeSmall": {},
            "&.MuiIcon-fontSizeMedium": {},
            "&.MuiIcon-fontSizeLarge": {},
          },
        },
      },
    },
  };

  const allIconsComponents = iconsPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Icon>"
  ) as ComponentSetNode[];

  allIconsComponents.forEach((iconComponentSet) => {
    if (iconComponentSet.type === "COMPONENT_SET") {
      iconComponentSet.children.forEach((iconVariant) => {
        if (iconVariant.type === "COMPONENT") {
          const { Size, Type } = iconVariant.variantProperties || {};

          // Determine size class for both MuiSvgIcon and MuiIcon
          const svgSizeClass =
            Size === "Small"
              ? "&.MuiSvgIcon-fontSizeSmall"
              : Size === "Medium"
              ? "&.MuiSvgIcon-fontSizeMedium"
              : Size === "Large"
              ? "&.MuiSvgIcon-fontSizeLarge"
              : "&.MuiSvgIcon-fontSizeInherit";

          const iconSizeClass =
            Size === "Small"
              ? "&.MuiIcon-fontSizeSmall"
              : Size === "Medium"
              ? "&.MuiIcon-fontSizeMedium"
              : Size === "Large"
              ? "&.MuiIcon-fontSizeLarge"
              : "&.MuiIcon-fontSizeInherit";

          // Locate main node (Icon or Material Icons)
          const mainNode =
            iconVariant.children.find((node) => node.name === "Icon") ||
            iconVariant.children.find((node) => node.name === "Material Icons");

          if (mainNode) {
            const stylesData = {
              ...Object.fromEntries(
                Object.entries(styles.getFontSizeCss(mainNode)).map(
                  ([key, value]) => [key, `${value} !important`]
                )
              ),
              ...styles.getWidthCss(mainNode),
              ...styles.getHeightCss(mainNode),
            };

            // Apply styles based on Type and Size
            if (Type === "SVG Icon") {
              iconsConfig.MuiSvgIcon.styleOverrides.root[svgSizeClass] = {
                ...stylesData,
              };
            } else if (Type === "Font Icon") {
              iconsConfig.MuiIcon.styleOverrides.root["&.material-icons"][
                iconSizeClass
              ] = {
                ...stylesData,
              };
            }
          }
        }
      });
    }
  });

  return iconsConfig;
}
