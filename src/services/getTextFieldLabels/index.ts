import VariantStandard from "./variantStandard";
import VariantFilled from "./variantFilled";
import VariantOutlined from "./variantOutlined";

export default function getTextFieldLabels() {
  return {
    MuiTextField: {
      styleOverrides: {
        root: {
          ...VariantStandard(),
          ...VariantFilled(),
          ...VariantOutlined(),
        },
      },
    },
  };
}
