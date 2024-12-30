export default function getShapes() {
  console.log("Fetching Shapes...");

  // Get the variable collection for breakpoints
  const shapeCollection = figma.variables
    .getLocalVariableCollections()
    .find((collection) => collection.name === "shape");

  if (!shapeCollection) return {};

  const shape = shapeCollection.variableIds.reduce<Record<string, string>>(
    (acc, variableId) => {
      const variable = figma.variables.getVariableById(variableId);
      if (variable && variable.valuesByMode) {
        const modeId = Object.keys(variable.valuesByMode)[0];
        const value = variable.valuesByMode[modeId];
        acc[variable.name] = `${value}px`;
      }
      return acc;
    },
    {}
  );

  return shape;
}
