export default function getBreakpoints() {
  console.log("Fetching Breakpoints...");
  // Get the variable collection for breakpoints
  const variableCollection = figma.variables
    .getLocalVariableCollections()
    .find((collection) => collection.name === "breakpoints");

  if (!variableCollection) return {};

  const breakpoints = variableCollection.variableIds.reduce<
    Record<string, string>
  >((acc, variableId) => {
    const variable = figma.variables.getVariableById(variableId);
    if (variable && variable.valuesByMode) {
      const modeId = Object.keys(variable.valuesByMode)[0];
      const value = variable.valuesByMode[modeId];
      acc[variable.name] = `${value}px`;
    }
    return acc;
  }, {});

  return breakpoints;
}
