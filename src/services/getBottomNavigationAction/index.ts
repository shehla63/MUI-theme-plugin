import { styles } from "../../utils";

export default function getBottomNavigationAction() {
  console.log("Fetching Bottom Navigation Action...");

  const bottomNavigationActionPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Bottom Navigation"
  );

  if (!bottomNavigationActionPage) {
    console.log("BottomNavigationAction page not found.");
    return {};
  }

  const bottomNavigationConfig: Record<string, any> = {
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            "&:active": {},
            "&:disabled": {},
            "&:focus": {},
          },
          ":not(&.Mui-selected)": {
            "&:active": {},
            "&:focus": {},
          },
          "&.MuiBottomNavigationAction-iconOnly": {
            "&:active": {},
            "&:focus": {},
            "&:disabled": {},
          },
        },
      },
    },
  };

  const allBottomNavigationActionComponents =
    bottomNavigationActionPage.findAll(
      (node) =>
        node.type === "COMPONENT_SET" &&
        node.name === "<BottomNavigationAction>"
    ) as ComponentSetNode[];

  allBottomNavigationActionComponents.forEach((componentSet) => {
    componentSet.children.forEach((variant) => {
      if (variant.type === "COMPONENT") {
        const variantProps = variant.variantProperties;

        if (
          variantProps &&
          "Active" in variantProps &&
          "Label" in variantProps &&
          "State" in variantProps
        ) {
          const { Active, Label, State } = variantProps;
          const isActive = Active === "True";
          const hasLabel = Label === "True";

          let activeSelector = "&.Mui-selected";
          if (!isActive) {
            activeSelector = hasLabel
              ? ":not(&.Mui-selected)"
              : "&.MuiBottomNavigationAction-iconOnly";
          }

          const fullSelector = `${activeSelector}.root`;

          // Extract padding directly from the variant node
          const paddingCss = styles.getPaddingCss(variant);

          // Extract color from the FavouriteFilled > Vector node
          let colorCss = {};
          const favouriteFilledNode = variant.findChild(
            (node) => node.name === "FavouriteFilled"
          );
          if (favouriteFilledNode && "children" in favouriteFilledNode) {
            const vectorNode = favouriteFilledNode.children.find((node) =>
              node.name.includes("Vector")
            );
            if (vectorNode) {
              colorCss = styles.getColorOrBackgroundCss(vectorNode, "color");
            }
          }

          // Extract font details from Text Wrapper > Tab one node
          let textCss = {};
          const textWrapperNode = variant.findChild(
            (node) => node.name === "Text Wrapper"
          );
          if (textWrapperNode && "children" in textWrapperNode) {
            const tabOneNode = textWrapperNode.children.find(
              (node) => node.name === "Tab one"
            );
            if (tabOneNode) {
              textCss = {
                ...styles.getFontFamilyCss(tabOneNode),
                ...styles.getFontSizeCss(tabOneNode),
                ...styles.getLetterSpacingCss(tabOneNode),
                ...styles.getFontWeightCss(tabOneNode),
                ...styles.getColorOrBackgroundCss(tabOneNode, "color"),
              };
            }
          }

          // Extract background from focusRipple node
          let backgroundCss = {};
          const focusRippleNode = variant.findChild(
            (node) => node.name === "focusRipple"
          );

          if (focusRippleNode && "children" in focusRippleNode) {
            const backgroundNode =
              focusRippleNode.children.length === 0
                ? focusRippleNode
                : focusRippleNode.children.find(
                    (node) => node.name === "focusRipple"
                  );

            if (backgroundNode) {
              backgroundCss = styles.getColorOrBackgroundCss(
                backgroundNode,
                "background"
              );
            }
          }

          const baseCss = {
            ...colorCss,
            ...textCss,
            ...paddingCss,
            ...backgroundCss,
          };

          // Initialize the state-specific CSS object if not already initialized
          if (
            !bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides
              .root[activeSelector]
          ) {
            bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides.root[
              activeSelector
            ] = {
              "&:active": {},
              "&:disabled": {},
              "&:focus": {},
            };
          }

          switch (State) {
            case "Enabled":
              bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides.root[
                activeSelector
              ] = {
                ...bottomNavigationConfig.MuiBottomNavigationAction
                  .styleOverrides.root[activeSelector],
                ...baseCss,
              };
              break;
            case "Focused":
              let color = {};
              if (backgroundCss && "background" in backgroundCss) {
                color = { color: backgroundCss.background };
              }
              bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides.root[
                activeSelector
              ]["&:focus"] = baseCss;
              bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides.root[
                activeSelector
              ]["&:focus"][".MuiTouchRipple-root"] = {
                ...color,
              };
              break;
            case "Pressed":
              bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides.root[
                activeSelector
              ]["&:active"] = baseCss;
              break;
            case "Disabled":
              bottomNavigationConfig.MuiBottomNavigationAction.styleOverrides.root[
                activeSelector
              ]["&:disabled"] = baseCss;
              break;
          }
        }
      }
    });
  });

  return bottomNavigationConfig;
}
