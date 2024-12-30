import { styles } from "../../utils";

// Helper function to check if a node has children
function hasChildren(
  node: SceneNode
): node is FrameNode | GroupNode | ComponentNode | InstanceNode {
  return "children" in node && Array.isArray(node.children);
}

interface ButtonGroupConfig {
  [key: string]: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

interface SliderConfig {
  MuiSlider: {
    styleOverrides: ButtonGroupConfig;
  };
}

export default function getSlider() {
  console.log("Fetching Slider...");

  const sliderConfig: SliderConfig = {
    MuiSlider: {
      styleOverrides: {
        root: {
          "&:not(&.MuiSlider-vertical)": {
            "&.MuiSlider-colorPrimary": {
              "&.MuiSlider-sizeMedium": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
              "&.MuiSlider-sizeSmall": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
            },
            "&.MuiSlider-colorSecondary": {
              "&.MuiSlider-sizeMedium": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
              "&.MuiSlider-sizeSmall": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
            },
          },
          "&.MuiSlider-vertical": {
            "&.MuiSlider-colorPrimary": {
              "&.MuiSlider-sizeMedium": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
              "&.MuiSlider-sizeSmall": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
            },
            "&.MuiSlider-colorSecondary": {
              "&.MuiSlider-sizeMedium": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
              "&.MuiSlider-sizeSmall": {
                ".MuiSlider-thumb": {
                  ":hover": {},
                  "&.Mui-disabled": {},
                },
              },
            },
          },
        },
      },
    },
  };

  const sliderPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Slider"
  );

  if (!sliderPage) {
    console.warn("Slider page not found.");
    return sliderConfig;
  }

  const sliderComponents = sliderPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Slider>"
  ) as ComponentSetNode[];

  sliderComponents.forEach((sliderComponentSet) => {
    sliderComponentSet.children.forEach((sliderVariant) => {
      if (sliderVariant.type === "COMPONENT") {
        const variantProps = sliderVariant.variantProperties;

        if (
          variantProps &&
          "Size" in variantProps &&
          "Variant" in variantProps &&
          "Color" in variantProps &&
          "State" in variantProps &&
          "Orientation" in variantProps
        ) {
          const { Size, Variant, Color, State, Orientation } = variantProps;

          // Find "Slider" node under sliderVariant
          const sliderNode = hasChildren(sliderVariant)
            ? sliderVariant.children.find((child) => child.name === "Slider")
            : null;

          if (!sliderNode || !hasChildren(sliderNode)) {
            console.warn("Slider node not found or has no children.");
            return;
          }

          // Find "_SliderThumb" node under Slider
          const sliderThumbNode = sliderNode.children.find(
            (child) => child.name === "_SliderThumb"
          );

          if (!sliderThumbNode) {
            console.warn("_SliderThumb node not found under Slider");
            return;
          }

          // Get width, height, and color from _SliderThumb
          const width = styles.getWidthCss(sliderThumbNode);
          const height = styles.getHeightCss(sliderThumbNode);
          const color = styles.getColorOrBackgroundCss(
            sliderThumbNode,
            "color"
          );

          // Check if _SliderThumb has children
          const hasThumbChildren = hasChildren(sliderThumbNode);

          // Get hover color from Overlay if _SliderThumb has children, otherwise use _SliderThumb
          const hoverOverlayNode = hasThumbChildren
            ? sliderThumbNode.children.find((child) => child.name === "Overlay")
            : sliderThumbNode;
          const hoverColor = styles.getColorOrBackgroundCss(
            hoverOverlayNode ?? sliderThumbNode,
            "color"
          );
          const hoverBoxShadow = styles.getBoxShadowCSS(
            hoverOverlayNode ?? sliderThumbNode
          );

          // Get box shadow from Color if _SliderThumb has children, otherwise use _SliderThumb
          const colorNode = hasThumbChildren
            ? sliderThumbNode.children.find((child) => child.name === "Color")
            : sliderThumbNode;
          const boxShadow = styles.getBoxShadowCSS(
            colorNode ?? sliderThumbNode
          );

          // Build keys dynamically
          const orientationKey =
            Orientation === "Horizontal"
              ? "&:not(&.MuiSlider-vertical)"
              : `&.MuiSlider-${Orientation.toLowerCase()}`;

          const colorKey = `&.MuiSlider-color${Color}`;
          const sizeKey = `&.MuiSlider-size${Size}`;
          const thumbKey = ".MuiSlider-thumb";

          // Ensure the structure exists for orientation, color, and size
          if (!sliderConfig.MuiSlider.styleOverrides.root[orientationKey]) {
            sliderConfig.MuiSlider.styleOverrides.root[orientationKey] = {};
          }

          if (
            !sliderConfig.MuiSlider.styleOverrides.root[orientationKey][
              colorKey
            ]
          ) {
            sliderConfig.MuiSlider.styleOverrides.root[orientationKey][
              colorKey
            ] = {};
          }

          if (
            !sliderConfig.MuiSlider.styleOverrides.root[orientationKey][
              colorKey
            ][sizeKey]
          ) {
            sliderConfig.MuiSlider.styleOverrides.root[orientationKey][
              colorKey
            ][sizeKey] = {
              [thumbKey]: {
                ":hover": {},
                "&.Mui-disabled": {},
              },
            };
          }

          // Add state-specific styles
          const thumbStyles =
            sliderConfig.MuiSlider.styleOverrides.root[orientationKey][
              colorKey
            ][sizeKey][thumbKey];

          if (State === "Enabled") {
            Object.assign(thumbStyles, {
              ...width,
              ...height,
              ...color,
              ...boxShadow,
            });
          } else if (State === "Hover") {
            thumbStyles[":hover"] = {
              ...hoverColor,
              ...hoverBoxShadow,
            };
          } else if (State === "Disabled") {
            thumbStyles["&.Mui-disabled"] = {
              ...width,
              ...height,
              ...color,
            };
          }
        }
      }
    });
  });

  return sliderConfig;
}
