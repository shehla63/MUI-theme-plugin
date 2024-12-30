import { styles } from "../../../utils";

export const getChartsLegend = (direction: string) => {
  console.log(`Fetching Charts Legend ${direction}...`);

  // Find the "Charts" page in the document
  const chartsPage = figma.root.children.find(
    (node) => node.type === "PAGE" && node.name.trim() === "Charts"
  );

  if (!chartsPage) {
    console.log("Charts page not found");
    return {};
  }

  // Find the "Elements" layer within the "Charts" page
  const elementsLayer = chartsPage.children.find(
    (layer) => layer.name.trim() === "Elements"
  );

  if (!elementsLayer || !("children" in elementsLayer)) {
    console.log('Layer named "Elements" not found or it has no children');
    return {};
  }

  // Find all "Grid" layers within the "Elements" layer
  const gridLayers: any = elementsLayer.children.filter(
    (child) => child.name.trim() === "Grid"
  );

  const frame18Node = gridLayers[0].children[4].children[1];

  const elementsLegendNode = frame18Node.children.find(
    (child: any) => child.name.trim() === "Elements / Legend"
  );

  if (!elementsLegendNode || !("children" in elementsLegendNode)) {
    console.log(
      'Node named "Elements / Legend" not found or it has no children'
    );
    return {};
  }

  const verticalNode = elementsLegendNode.children.find(
    (child: any) => child.name.trim() === `Direction=${direction}`
  );

  if (!verticalNode || !("children" in verticalNode)) {
    console.log('Node named "Vertical" not found or it has no children');
    return {};
  }

  const legendNode = verticalNode.children.find(
    (child: any) => child.name.trim() === "Legend"
  );

  if (!legendNode || !("children" in legendNode)) {
    console.log('Node named "Legend" not found or it has no children');
    return {};
  }

  const series1Node = legendNode.children.find(
    (child: any) => child.name.trim() === "Series 1"
  );

  if (!series1Node) {
    console.log('Node named "Series 1" not found within Legend');
    return {};
  }

  return {
    "& text": {
      ...Object.fromEntries(
        Object.entries(styles.getColorOrBackgroundCss(series1Node, "fill")).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
      ...Object.fromEntries(
        Object.entries(styles.getFontFamilyCss(series1Node)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
      ...Object.fromEntries(
        Object.entries(styles.getFontSizeCss(series1Node)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
      ...Object.fromEntries(
        Object.entries(styles.getFontWeightCss(series1Node)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
      ...Object.fromEntries(
        Object.entries(styles.getLineHeightCss(series1Node)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
      ...Object.fromEntries(
        Object.entries(styles.getLetterSpacingCss(series1Node)).map(
          ([key, value]) => [key, `${value} !important`]
        )
      ),
    },
  };
};
