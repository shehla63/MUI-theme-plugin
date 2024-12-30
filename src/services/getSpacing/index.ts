export default function getSpacing() {
  console.log("Fetching Spacing...");

  const SpacingCollection = figma.variables
    .getLocalVariableCollections()
    .find((collection) => collection.name === "spacing");

  if (!SpacingCollection) return {};
  const spacing = SpacingCollection.variableIds.reduce<Record<string, string>>(
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
  return spacing;
}
