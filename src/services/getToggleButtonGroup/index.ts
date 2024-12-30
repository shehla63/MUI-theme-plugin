import { styles } from "../../utils";

interface ButtonGroupConfig {
  [key: string]: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

interface ToggleButtonGroupConfig {
  MuiToggleButtonGroup: {
    styleOverrides: ButtonGroupConfig;
  };
}

export default function getToggleButtonGroup() {
  console.log("Fetching Toggle Button Group...");

  const toggleButtonGroupConfig: ToggleButtonGroupConfig = {
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          "&.MuiToggleButtonGroup-horizontal": {
            ".MuiToggleButton-sizeMedium": {},
            ".MuiToggleButton-sizeSmall": {},
            ".MuiToggleButton-sizeLarge": {},
          },
          "&.MuiToggleButtonGroup-vertical": {
            ".MuiToggleButton-sizeMedium": {},
            ".MuiToggleButton-sizeSmall": {},
            ".MuiToggleButton-sizeLarge": {},
          },
        },
      },
    },
  };

  const toggleButtonPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Toggle Button"
  );

  if (!toggleButtonPage) {
    return {};
  }

  const toggleButtonGroupComponents = toggleButtonPage.findAll(
    (node) =>
      node.type === "COMPONENT_SET" && node.name === "<ToggleButtonGroup>"
  ) as ComponentSetNode[];

  toggleButtonGroupComponents.forEach((toggleButtonGroupComponentSet) => {
    toggleButtonGroupComponentSet.children.forEach((toggleButtonVariant) => {
      if (toggleButtonVariant.type === "COMPONENT") {
        const variantProps = toggleButtonVariant.variantProperties;

        if (
          variantProps &&
          "Orientation" in variantProps &&
          "Size" in variantProps &&
          "Single" in variantProps &&
          variantProps.Single === "False"
        ) {
          const { Orientation, Size } = variantProps;

          const borderRadius = styles.getBorderRadiusCss(toggleButtonVariant);

          // Build keys dynamically
          const orientationKey = `&.MuiToggleButtonGroup-${Orientation.toLowerCase()}`;
          const sizeKey = `.MuiToggleButton-size${Size}`;

          // Ensure the structure exists for orientation and size
          if (
            !toggleButtonGroupConfig.MuiToggleButtonGroup.styleOverrides.root[
              orientationKey
            ]
          ) {
            toggleButtonGroupConfig.MuiToggleButtonGroup.styleOverrides.root[
              orientationKey
            ] = {};
          }

          if (
            !toggleButtonGroupConfig.MuiToggleButtonGroup.styleOverrides.root[
              orientationKey
            ][sizeKey]
          ) {
            toggleButtonGroupConfig.MuiToggleButtonGroup.styleOverrides.root[
              orientationKey
            ][sizeKey] = {};
          }

          // Add grouped styles
          toggleButtonGroupConfig.MuiToggleButtonGroup.styleOverrides.root[
            orientationKey
          ][sizeKey]["&.MuiToggleButtonGroup-grouped.MuiToggleButton-root"] = {
            ...(Orientation === "Horizontal"
              ? {
                  "&.MuiToggleButtonGroup-firstButton": {
                    ...borderRadius,
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                  },
                  "&.MuiToggleButtonGroup-lastButton": {
                    ...borderRadius,
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  },
                }
              : {
                  // Vertical-specific styles
                  "&.MuiToggleButtonGroup-firstButton": {
                    ...borderRadius,
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                  },
                  "&.MuiToggleButtonGroup-lastButton": {
                    ...borderRadius,
                    borderTopLeftRadius: "0px",
                    borderTopRightRadius: "0px",
                  },
                }),
          };
        }
      }
    });
  });

  return toggleButtonGroupConfig;
}
