import { rgbToHex } from "../../utils";

export default function getCheckBox() {
  console.log("Fetching Checkbox...");

  const checkboxPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.includes("Checkbox")
  );

  if (!checkboxPage) {
    console.log("Checkbox page not found.");
    return {};
  }

  const checkboxConfig: Record<string, any> = {};

  const allCheckboxComponents = checkboxPage.findAll(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Checkbox>"
  ) as ComponentSetNode[];

  allCheckboxComponents.forEach((checkboxComponentSet) => {
    if (checkboxComponentSet.type === "COMPONENT_SET") {
      checkboxComponentSet.children.forEach((checkboxVariant) => {
        if (checkboxVariant.type === "COMPONENT") {
          const variantProps = checkboxVariant.variantProperties;

          if (
            variantProps &&
            "Checked" in variantProps &&
            "Color" in variantProps &&
            "Indeterminate" in variantProps &&
            "Size" in variantProps &&
            "State" in variantProps
          ) {
            const { Checked, Color, Indeterminate, State, Size } = variantProps;
            const isChecked = Checked === "True";
            const isIndeterminate = Indeterminate === "True";
            const colorClass = `.MuiCheckbox-color${Color}`;
            const stateClass = isChecked
              ? ".Mui-checked"
              : ":not(.Mui-checked)";
            const indeterminateClass = isIndeterminate
              ? ".MuiCheckbox-indeterminate"
              : ":not(.MuiCheckbox-indeterminate)";
            const sizeClass = `.MuiCheckbox-size${Size}`;

            // Create a fully qualified selector
            const fullSelector = `&${indeterminateClass}${stateClass}${colorClass}${sizeClass}`;

            const ripple = checkboxVariant.children.find(
              (node) => node.name === "focusRipple"
            ) as RectangleNode;

            const paddingNode = checkboxVariant.children.find(
              (node) => node.name === "Padding"
            ) as FrameNode;

            const {
              verticalPadding = "",
              horizontalPadding = "",
              width = "",
              height = "",
            } = paddingNode || {};

            let vectorElement;
            if (paddingNode && "children" in paddingNode) {
              const hiddenNode = paddingNode.children.find(
                (node) => node.name === "_hidden"
              );

              if (hiddenNode && "children" in hiddenNode) {
                vectorElement = hiddenNode.children.find((node) =>
                  node.name.includes("Vector")
                );
              }
            }

            let color = "";
            if (
              vectorElement &&
              "fills" in vectorElement &&
              Array.isArray(vectorElement.fills) &&
              vectorElement.fills.length > 0
            ) {
              const fillColor = vectorElement.fills[0];
              if ("color" in fillColor && "opacity" in fillColor) {
                color = rgbToHex({
                  ...fillColor.color,
                  a: fillColor.opacity,
                });
              }
            }

            const { cornerRadius = undefined, fills = undefined } =
              ripple || {};

            let background = "";
            if (Array.isArray(fills) && fills.length > 0) {
              background = rgbToHex({
                ...fills[0].color,
                a: fills[0].opacity,
              });
            }

            // Base styles for the variant using existing width and height
            const baseCss = {
              ...(background ? { background } : {}),
              ...(cornerRadius
                ? { borderRadius: `${String(cornerRadius)}px` }
                : {}),
              ...(color ? { color } : {}),
              ...(width ? { width: `${String(width)}px` } : {}), // Use fetched width
              ...(height ? { height: `${String(height)}px` } : {}), // Use fetched height
              ...(verticalPadding || horizontalPadding
                ? { padding: `${verticalPadding}px ${horizontalPadding}px` }
                : {}),
            };

            // Initialize the fullSelector in checkboxConfig if it doesn't exist
            if (!checkboxConfig[fullSelector]) {
              checkboxConfig[fullSelector] = {
                ...baseCss,
                "&:hover": {},
                "&:focus": {},
                "&:active": {},
                "&.Mui-disabled": {},
              };
            }

            // Apply styles based on the State property
            switch (State) {
              case "Enabled":
                checkboxConfig[fullSelector] = {
                  ...baseCss,
                  "&:hover": {},
                  "&:focus": {},
                  "&:active": {},
                  "&.Mui-disabled": {},
                };
                break;
              case "Hovered":
                checkboxConfig[fullSelector]["&:hover"] = baseCss;
                break;
              case "Focused":
                checkboxConfig[fullSelector]["&:focus"] = baseCss;
                break;
              case "Pressed":
                checkboxConfig[fullSelector]["&:active"] = baseCss;
                break;
              case "Disabled":
                checkboxConfig[fullSelector]["&.Mui-disabled"] = baseCss;
                break;
            }
          }
        }
      });
    }
  });

  // Wrap checkboxConfig in the specified structure
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: checkboxConfig,
      },
    },
  };
}
