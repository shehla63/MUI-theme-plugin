import getMenuItem from "../getMenuItem";
import getMenuList from "../getMenuList";

export default function getMenu() {
  console.log("Fetching Menu...");

  return {
    ...getMenuItem(),
    ...getMenuList(),
  };
}
