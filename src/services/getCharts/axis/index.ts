import { styles } from "../../../utils";

export const getChartsXAxis = () => {
  console.log("Fetching Charts X Axis...");

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

  const xAxisNode = gridLayers[0].children[2].children[1];

  if (!("children" in xAxisNode)) {
    return {};
  }

  const frame23Node = xAxisNode.children.find(
    (child: any) => child.name.trim() === "Frame 23"
  );

  if (!frame23Node || !("children" in frame23Node)) {
    console.log(
      'Node named "Frame 23" not found within X Axis or it has no children'
    );
    return {};
  }

  const elementsAxisXNode = frame23Node.children.find(
    (child: any) => child.name.trim() === "Elements / Axis X | Groups Bottom"
  );

  if (!elementsAxisXNode || !("children" in elementsAxisXNode)) {
    console.log(
      'Node named "Elements / Axis X | Groups Bottom" not found or it has no children'
    );
    return {};
  }

  const node7 = elementsAxisXNode.children.find(
    (child: any) => child.name.trim() === "Groups=7"
  );

  if (!node7 || !("children" in node7)) {
    console.log('Node named "7" not found or it has no children');
    return {};
  }

  const dataNode = node7.children.find(
    (child: any) => child.name.trim() === "Data"
  );

  if (!dataNode || !("children" in dataNode)) {
    console.log('Node named "Data" not found or it has no children');
    return {};
  }

  const singleGroupNode = dataNode.children.find(
    (child: any) => child.name.trim() === "Groups"
  );

  if (!singleGroupNode) {
    console.log('Node named "Groups" not found within Data');
    return {};
  }

  const groupNode = singleGroupNode.children.find(
    (child: any) => child.name.trim() === "Group"
  );

  return {
    "&.MuiChartsAxis-directionX": {
      "& .MuiChartsAxis-tickLabel": {
        ...styles.getColorOrBackgroundCss(groupNode, "fill"),
        ...styles.getFontFamilyCss(groupNode),
        ...styles.getFontWeightCss(groupNode),
        ...styles.getLineHeightCss(groupNode),
        ...styles.getLetterSpacingCss(groupNode),
        ...Object.fromEntries(
          Object.entries(styles.getFontSizeCss(groupNode)).map(
            ([key, value]) => [key, `${value} !important`]
          )
        ),
      },
    },
  };
};

export const getChartsYAxis = () => {
  console.log("Fetching Charts Y Axis...");

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

  const frame25Node = gridLayers[0].children[3].children[1];

  const elementsAxisYNode = frame25Node.children.find(
    (child: any) => child.name.trim() === "Elements / Axis Y | Values Left"
  );

  if (!elementsAxisYNode || !("children" in elementsAxisYNode)) {
    console.log(
      'Node named "Elements / Axis Y | Values Left" not found or it has no children'
    );
    return {};
  }

  const valuesNode = elementsAxisYNode.children.find(
    (child: any) => child.name.trim() === "Values=7"
  );

  if (!valuesNode || !("children" in valuesNode)) {
    console.log('Node named "Values=7" not found or it has no children');
    return {};
  }

  const rightTicksNode = valuesNode.children.find(
    (child: any) => child.name.trim() === "Right Ticks"
  );

  if (!rightTicksNode || !("children" in rightTicksNode)) {
    console.log('Node named "Right Ticks" not found or it has no children');
    return {};
  }

  const tickNode = rightTicksNode.children.find(
    (child: any) => child.name.trim() === "Tick"
  );

  if (!tickNode || !("children" in tickNode)) {
    console.log('Node named "Tick" not found or it has no children');
    return {};
  }

  const node100 = tickNode.children.find(
    (child: any) => child.name.trim() === "100"
  );

  if (!node100) {
    console.log('Node named "100" not found within Tick');
    return {};
  }

  return {
    "&.MuiChartsAxis-directionY": {
      "& .MuiChartsAxis-tickLabel": {
        ...styles.getColorOrBackgroundCss(node100, "fill"),
        ...styles.getFontFamilyCss(node100),
        ...styles.getFontWeightCss(node100),
        ...styles.getLineHeightCss(node100),
        ...styles.getLetterSpacingCss(node100),
        ...Object.fromEntries(
          Object.entries(styles.getFontSizeCss(node100)).map(([key, value]) => [
            key,
            `${value} !important`,
          ])
        ),
      },
    },
  };
};
