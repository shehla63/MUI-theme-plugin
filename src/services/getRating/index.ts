import { styles } from "../../utils";

export default function getRating() {
  console.log("Fetching Rating");

  const ratingPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Rating"
  );

  if (!ratingPage) {
    console.log("Rating page not found.");
    return {};
  }

  const ratingConfig: Record<string, any> = {
    "&.MuiRating-sizeMedium": {
      "& .MuiRating-decimal": {
        "&:not(.MuiRating-iconActive)": {
          "& .MuiRating-icon": {
            "&.MuiRating-iconHover": {}, // Hovered True
          },
        },
        "& .MuiRating-iconFilled.MuiRating-icon": {
          "&.MuiRating-iconHover": {}, // Hovered True
        },
      },
    },
    "&.MuiRating-sizeSmall": {
      "& .MuiRating-decimal": {
        "&:not(.MuiRating-iconActive)": {
          "& .MuiRating-icon": {
            "&.MuiRating-iconHover": {}, // Hovered True
          },
        },
        "& .MuiRating-iconFilled.MuiRating-icon": {
          "&.MuiRating-iconHover": {}, // Hovered True
        },
      },
    },
    "&.MuiRating-sizeLarge": {
      "& .MuiRating-decimal": {
        "&:not(.MuiRating-iconActive)": {
          "& .MuiRating-icon": {
            "&.MuiRating-iconHover": {}, // Hovered True
          },
        },
        "& .MuiRating-iconFilled.MuiRating-icon": {
          "&.MuiRating-iconHover": {}, // Hovered True
        },
      },
    },
  };

  const starComponent = ratingPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "Star"
  ) as ComponentSetNode;

  starComponent.children.forEach((starVariant) => {
    if (starVariant.type === "COMPONENT") {
      const { Size, Active, Hovered } = starVariant.variantProperties || {};

      if (Active === "False" || Active === "Full") {
        const starNode =
          starVariant.children.find(
            (node) => node.name === "StarOutlineFilled"
          ) || starVariant.children.find((node) => node.name === "StarSharp");

        const vectorNode =
          starNode &&
          "children" in starNode &&
          starNode.children.find((node) => node.name === "Vector");

        const sizeClass =
          Size === "Medium*"
            ? "&.MuiRating-sizeMedium"
            : Size === "Large"
            ? "&.MuiRating-sizeLarge"
            : "&.MuiRating-sizeSmall";

        const stateClass =
          Active === "False"
            ? "&:not(.MuiRating-iconActive)"
            : "& .MuiRating-iconFilled.MuiRating-icon";

        const hoverClass = Hovered === "true" ? "&.MuiRating-iconHover" : "";

        if (vectorNode) {
          const colorStyle = styles.getColorOrBackgroundCss(
            vectorNode,
            "color"
          );

          // Active False
          if (Active === "False") {
            const targetConfig =
              ratingConfig[sizeClass]["& .MuiRating-decimal"][stateClass][
                "& .MuiRating-icon"
              ];

            if (Hovered === "false") {
              Object.assign(targetConfig, { ...colorStyle });
            }

            if (Hovered === "true") {
              targetConfig[hoverClass] = {
                ...colorStyle,
              };
            }
          }

          // Active Full
          if (Active === "Full") {
            const targetConfig =
              ratingConfig[sizeClass]["& .MuiRating-decimal"][stateClass];

            Object.assign(targetConfig, { ...colorStyle });

            if (Hovered === "true") {
              targetConfig[hoverClass] = {
                ...colorStyle,
              };
            }
          }
        }
      }
    }
  });

  return {
    MuiRating: {
      styleOverrides: {
        root: ratingConfig,
      },
    },
  };
}
