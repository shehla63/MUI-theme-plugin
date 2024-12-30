import VariantFilled from "./variantFilled";
import VariantOutlined from "./variantOutlined";
import VariantStandard from "./variantStandard";

export default function getTextfield() {
  return {
    MuiInputBase: {
      styleOverrides: {
        root: {
          ...VariantOutlined(),
          ...VariantStandard(),
          ...VariantFilled(),
        },
      },
    },
  };
}
