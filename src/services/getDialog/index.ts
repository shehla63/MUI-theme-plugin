import getDialogTitle from "../getDialogTitle";
import getDialogContent from "../getDialogContent";
import getDialogAction from "../getDialogActions";

export default function getDialog() {
  const style = {
    ...getDialogTitle(),
    ...getDialogContent(),
    ...getDialogAction(),
  };

  return style;
}
