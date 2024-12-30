import { rgbToHex } from "../../utils";

interface AvatarVariantStyles {
  [property: string]: any;
}

interface AvatarVariantConfig {
  [selector: string]: AvatarVariantStyles;
}

interface AvatarConfig {
  MuiAvatar: {
    styleOverrides: {
      root: AvatarVariantConfig;
    };
  };
}

export default function getAvatar(): AvatarConfig {
  
  console.log("Fetching avatar...");

  // Find the Avatar page in Figma
  const avatarPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Avatar"
  );

  if (!avatarPage) {
    console.error("Avatar page not found!");
    return {
      MuiAvatar: {
        styleOverrides: {
          root: {},
        },
      },
    };
  }

  // Find all avatar components or component sets
  const avatarComponents = avatarPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Avatar>"
  );

  const avatarConfig: AvatarConfig = {
    MuiAvatar: {
      styleOverrides: {
        root: {},
      },
    },
  };

  avatarComponents.forEach((componentSet) => {
    if (componentSet.type === "COMPONENT_SET") {
      componentSet.children.forEach((variantComponent) => {
        if (variantComponent.type === "COMPONENT") {
          const variantProperties = variantComponent?.variantProperties || {};
          const { Variant } = variantProperties;
          const { fills, cornerRadius } = variantComponent;

          // Extract background color
          let background = "";
          if (Array.isArray(fills) && fills.length > 0) {
            background = rgbToHex({
              ...fills[0].color,
              a: fills[0].opacity ?? 1,
            });
          }

          let borderRadius = "";
          if (
            cornerRadius !== figma.mixed &&
            typeof cornerRadius === "number"
          ) {
            borderRadius = `${cornerRadius}px`;
          }

          // Map variant properties to styles
          avatarConfig.MuiAvatar.styleOverrides.root[
            `.MuiAvatar-root&.MuiAvatar-${Variant.toLowerCase()}`
          ] = {
            background: background,
            borderRadius: borderRadius,
          };
        }
      });
    }
  });

  return avatarConfig;
}
