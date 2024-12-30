import { variablesToObjects } from "../../utils";

export default function getColors() {
  console.log("Fetching Colors...");
  const collections = figma.variables.getLocalVariableCollections();

  const colorsCollection = collections.find(
    (collection) => collection.name === "material/colors"
  );

  const variables = colorsCollection?.variableIds.map((id) =>
    figma.variables.getVariableById(id)
  );

  const defaultModeId = colorsCollection?.defaultModeId;
  const colorsData = variablesToObjects(variables as Variable[], defaultModeId);
  return colorsData;
}
