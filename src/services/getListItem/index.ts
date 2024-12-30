import { rgbToHex } from "../../utils";

interface ListConfig {
  MuiListItem: {
    styleOverrides: {
      root: {
        [key: string]: {
          backgroundColor?: string;
          padding?: string;
          color?: string;
          "& .MuiListItemText-secondary"?: { color: string }; // Add secondary text color override
        };
      };
    };
  };
}

export default function getListItem(): ListConfig {
  console.log("Fetching List Items...");

  const listsConfig: ListConfig = {
    MuiListItem: {
      styleOverrides: {
        root: {},
      },
    },
  };

  // Locate the "List" page in Figma
  const listPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "List"
  );

  if (!listPage) {
    console.warn("No 'List' page found in Figma.");
    return listsConfig;
  }

  // Fetch all <ListItem> components
  const listComponents = listPage.findAll((node) =>
    node.name.includes("<ListItem>")
  );

  listComponents.forEach((listComponentSet) => {
    if (listComponentSet.type === "COMPONENT_SET") {
      listComponentSet.children.forEach((listVariant) => {
        if (listVariant.type === "COMPONENT") {
          const variantProps = listVariant.variantProperties;

          if (variantProps) {
            // Extract background color from fills
            const fills = listVariant.fills;
            const backgroundColor =
              Array.isArray(fills) && fills.length > 0
                ? rgbToHex({ ...fills[0].color, a: fills[0].opacity })
                : "";

            function hasChildren(
              node: SceneNode
            ): node is FrameNode | GroupNode | ComponentNode {
              return "children" in node;
            }

            const containerChild = (listVariant.children as SceneNode[]).find(
              (child) => child.name === "Container"
            );

            let textColor = "";
            let secondaryTextColor = "";

            if (containerChild && hasChildren(containerChild)) {
              const listItemText = (
                containerChild.children as SceneNode[]
              ).find(
                (child) =>
                  child.name === "ListItem Text" && child.type === "FRAME"
              );

              const listItemTextTypo =
                listItemText && hasChildren(listItemText)
                  ? listItemText.children.find(
                      (child) =>
                        child.name === "List item" && child.type === "TEXT"
                    )
                  : null;

              const secondaryTextColorNode =
                listItemText && hasChildren(listItemText)
                  ? listItemText.children.find(
                      (child) =>
                        child.name === "Secondary" && child.type === "TEXT"
                    )
                  : null;

              textColor =
                listItemTextTypo &&
                listItemTextTypo.type === "TEXT" &&
                Array.isArray(listItemTextTypo.fills) &&
                listItemTextTypo.fills.length > 0 &&
                listItemTextTypo.fills[0].type === "SOLID"
                  ? rgbToHex({
                      ...listItemTextTypo.fills[0].color,
                      a: listItemTextTypo.fills[0].opacity,
                    })
                  : "";

              secondaryTextColor =
                secondaryTextColorNode &&
                secondaryTextColorNode.type === "TEXT" &&
                Array.isArray(secondaryTextColorNode.fills) &&
                secondaryTextColorNode.fills.length > 0 &&
                secondaryTextColorNode.fills[0].type === "SOLID"
                  ? rgbToHex({
                      ...secondaryTextColorNode.fills[0].color,
                      a: secondaryTextColorNode.fills[0].opacity,
                    })
                  : "";
            }

            const verticalPadding =
              containerChild && containerChild.type === "FRAME"
                ? containerChild.paddingTop || 0
                : 0;
            const horizontalPadding =
              containerChild && containerChild.type === "FRAME"
                ? containerChild.paddingLeft || 0
                : 0;

            const dense = variantProps.Dense === "True";
            const disableGutters = variantProps["Dis. Gutters"] === "True";
            const state = variantProps.State
              ? variantProps.State.toLowerCase()
              : "enabled";
            const selector = buildSelector(dense, disableGutters, state);

            // Apply background color, text color, secondary text color, and padding if defined
            if (backgroundColor || textColor || secondaryTextColor) {
              listsConfig.MuiListItem.styleOverrides.root[selector] = {
                backgroundColor,
                color: textColor,
                padding: `${verticalPadding}px ${horizontalPadding}px`,
                ...(secondaryTextColor && {
                  "& .MuiListItemText-secondary": { color: secondaryTextColor },
                }),
              };
            }
          }
        }
      });
    }
  });

  return listsConfig;
}

// Helper function to construct the CSS selector
function buildSelector(
  dense: boolean,
  disableGutters: boolean,
  state: string
): string {
  let selector = "";

  if (dense && disableGutters) {
    selector = "&.MuiListItem-dense.MuiListItem-guttersDisabled";
  } else if (dense && !disableGutters) {
    selector = "&.MuiListItem-dense:not(.MuiListItem-guttersDisabled)";
  } else if (!dense && disableGutters) {
    selector = "&:not(.MuiListItem-dense).MuiListItem-guttersDisabled";
  } else {
    selector = "&:not(.MuiListItem-dense):not(.MuiListItem-guttersDisabled)";
  }

  switch (state) {
    case "hovered":
      selector += ":hover";
      break;
    case "selected":
      selector += ".Mui-selected";
      break;
    case "focused":
      selector += ".Mui-focusVisible";
      break;
    case "pressed":
      selector += ":active";
      break;
    case "disabled":
      selector += ".Mui-disabled";
      break;
    default:
      break;
  }

  return selector;
}
