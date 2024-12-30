import { styles } from "../../utils";

export default function getLink() {
  console.log("Fetching Link...");

  const linkPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Link"
  );

  if (!linkPage) {
    console.log("Link page not found.");
    return {};
  }

  const linkConfig: Record<string, any> = {};

  const linkPageComponent = linkPage.findOne(
    (node) => node.type === "COMPONENT_SET" && node.name === "<Link>"
  ) as ComponentSetNode;

  if (linkPageComponent && linkPageComponent.type === "COMPONENT_SET") {
    linkPageComponent.children.forEach((linkVariant) => {
      if (linkVariant.type === "COMPONENT") {
        const variantProps = linkVariant.variantProperties;

        if (
          variantProps &&
          "State" in variantProps &&
          "Color" in variantProps &&
          "Underline" in variantProps
        ) {
          const { State, Color, Underline } = variantProps;
          const colorClass =
            Color === "Primary" ? "" : ".MuiTypography-inherit";
          const underlineClass =
            Underline === "Always"
              ? ".MuiLink-underlineAlways"
              : Underline === "Hover"
              ? ".MuiLink-underlineHover"
              : ".MuiLink-underlineNone";

          // Create a fully qualified selector
          const fullSelector = `&${colorClass}${underlineClass}`;

          const baseCss = {}; // Add specific base styles if needed

          // Initialize the fullSelector in linkConfig if it doesn't exist
          if (!linkConfig[fullSelector]) {
            linkConfig[fullSelector] = {
              "&:hover": {},
              "&:focus": {},
            };
          }

          // Apply styles based on the State property
          switch (State) {
            case "Enabled":
              linkConfig[fullSelector] = baseCss;
              break;
            case "Hovered":
              linkConfig[fullSelector]["&:hover"] = baseCss;
              break;
            case "Focused":
              linkConfig[fullSelector]["&:focus"] = {
                ...styles.getBorderRadiusCss(linkVariant),
                ...styles.getBordersCss(linkVariant),
                ...baseCss,
              };
              break;
          }
        }
      }
    });
  }

  // Wrap linkConfig in the specified structure
  return {
    MuiLink: {
      styleOverrides: {
        root: linkConfig,
      },
    },
  };
}
