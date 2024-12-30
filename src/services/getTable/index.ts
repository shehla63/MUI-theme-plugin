import getTableCellRow from "../getTableCellRow";
import getTableHead from "../getTableHead";

export default function getTable() {
  console.log("Fetching Table...");

  const style = {
    MuiTableCell: {
      styleOverrides: {
        head: {
          ...getTableHead(),
        },
      },
    },
    ...getTableCellRow(),
  };

  return style;
}
