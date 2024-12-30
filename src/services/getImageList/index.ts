import { rgbToHex, styles } from "../../utils";

interface ImageListItemBarVariantStyles {
  [property: string]: any;
}

interface ImageListItemBarVariantConfig {
  [selector: string]: ImageListItemBarVariantStyles;
}

interface ImageListItemBarConfig {
  MuiImageListItemBar: {
    styleOverrides: {
      root: ImageListItemBarVariantConfig;
    };
  };
}

export default function getImageListItemBar(): ImageListItemBarConfig {
  console.log("Fetching imageListItemBar...");

  // Find the ImageListItemBar page in Figma
  const imageListItemBarPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Image List"
  );

  if (!imageListItemBarPage) {
    console.error("ImageListItemBar page not found!");
    return {
      MuiImageListItemBar: {
        styleOverrides: {
          root: {},
        },
      },
    };
  }

  // Find all imageListItemBar components or component sets
  const imageListItemBarComponents = imageListItemBarPage.findAll(
    (node) =>
      node.type === "COMPONENT_SET" && node.name === "<ImageListItemBar>"
  );

  const imageListItemBarConfig: ImageListItemBarConfig = {
    MuiImageListItemBar: {
      styleOverrides: {
        root: {},
      },
    },
  };

  imageListItemBarComponents.forEach((componentSet) => {
    if (componentSet.type === "COMPONENT_SET") {
      function findNodeByName(node: SceneNode, name: string): SceneNode | null {
        if (node.name.trim().toLowerCase() === name.toLowerCase()) {
          return node;
        }
        if ("children" in node && node.children.length > 0) {
          for (const child of node.children) {
            const found = findNodeByName(child, name);
            if (found) return found;
          }
        }
        return null;
      }

      // Find the TitleWrap node
      const titleWrapNode = findNodeByName(componentSet, "TitleWrap");

      if (!titleWrapNode) {
        console.warn(
          "TitleWrap node not found. Available children:",
          componentSet.children.map((child) => child.name)
        );
        return; // Exit early if TitleWrap is not found
      }

      if (titleWrapNode && "children" in titleWrapNode) {

        // Find the Title and Subtitle nodes
        const titleNode = titleWrapNode.children.find(
          (node) => node.name.trim() === "{Title}" && node.type === "TEXT"
        );
        const subtitleNode = titleWrapNode.children.find(
          (node) => node.name.trim() === "{Subtitle}" && node.type === "TEXT"
        );

        if (!titleNode) {
          console.warn("Title node not found.");
        } 

        if (!subtitleNode) {
          console.warn("Subtitle node not found.");
        }

        // Extract styles for Title
        const titleColor = styles.getColorOrBackgroundCss(
          titleNode,
          "color"
        )?.color;
        const titleFontSize = styles.getFontSizeCss(titleNode)?.fontSize;
        const titleFontWeight = styles.getFontWeightCss(titleNode)?.fontWeight;

        // Extract styles for Subtitle
        const subtitleColor = styles.getColorOrBackgroundCss(
          subtitleNode,
          "color"
        )?.color;
        const subtitleFontSize = styles.getFontSizeCss(subtitleNode)?.fontSize;
        const subtitleFontWeight =
          styles.getFontWeightCss(subtitleNode)?.fontWeight;

        // Update the config object with extracted styles
        imageListItemBarConfig.MuiImageListItemBar.styleOverrides.root = {
          "& .MuiImageListItemBar-titleWrap": {
            "& .MuiImageListItemBar-title": {
              color: titleColor,
              fontSize: titleFontSize,
              fontWeight: titleFontWeight,
            },
            "& .MuiImageListItemBar-subtitle": {
              color: subtitleColor,
              fontSize: subtitleFontSize,
              fontWeight: subtitleFontWeight,
            },
          },
        };
      }
    }
  });

  return imageListItemBarConfig;
}
