import { rgbToHex } from "./rgbToHex";

function getBorderStyle(dashPattern: any) {
  if (dashPattern.length === 0) {
    return "solid";
  } else if (
    dashPattern.length === 2 &&
    dashPattern[0] === 1 &&
    dashPattern[1] === 1
  ) {
    return "dotted";
  } else {
    return "dashed";
  }
}

function getBordersCss(
  element: any,
  useOnlyStrokes: boolean = false
): { [key: string]: string } {
  if (!element?.strokes?.length) {
    return {};
  }

  const { strokes, dashPattern = [] } = element;
  // Extract color from strokes array
  let borderColor = "";
  if (Array.isArray(strokes) && strokes.length > 0) {
    const stroke = strokes[0];
    if (stroke.color && stroke.opacity !== undefined) {
      borderColor = rgbToHex({
        ...stroke.color,
        a: stroke.opacity,
      });
    }
  }

  const borderStyle = getBorderStyle(dashPattern);

  if (useOnlyStrokes) {
    const { strokeWeight } = element;
    return {
      border: `${strokeWeight}px ${borderStyle} ${borderColor}`,
    };
  }

  const borders: { [key: string]: string } = {};

  // Add border styles based on weights
  if (element.strokeLeftWeight) {
    borders.borderLeft = `${element.strokeLeftWeight}px ${borderStyle} ${borderColor}`;
  }
  if (element.strokeRightWeight) {
    borders.borderRight = `${element.strokeRightWeight}px ${borderStyle} ${borderColor}`;
  }
  if (element.strokeTopWeight) {
    borders.borderTop = `${element.strokeTopWeight}px ${borderStyle} ${borderColor}`;
  }
  if (element.strokeBottomWeight) {
    borders.borderBottom = `${element.strokeBottomWeight}px ${borderStyle} ${borderColor}`;
  }

  return borders;
}

function getPaddingCss(element: any) {
  const {
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
  } = element || {};
  return {
    ...(paddingBottom !== 0 && { paddingBottom: `${paddingBottom}px` }),
    ...(paddingLeft !== 0 && { paddingLeft: `${paddingLeft}px` }),
    ...(paddingRight !== 0 && { paddingRight: `${paddingRight}px` }),
    ...(paddingTop !== 0 && { paddingTop: `${paddingTop}px` }),
  };
}

function getMarginCss(element: any) {
  const {
    paddingBottom = 0,
    paddingLeft = 0,
    paddingRight = 0,
    paddingTop = 0,
  } = element || {};
  return {
    ...(paddingBottom !== 0 && { marginBottom: `${paddingBottom}px` }),
    ...(paddingLeft !== 0 && { marginLeft: `${paddingLeft}px` }),
    ...(paddingRight !== 0 && { marginRight: `${paddingRight}px` }),
    ...(paddingTop !== 0 && { marginTop: `${paddingTop}px` }),
  };
}

function getFontFamilyCss(element: any) {
  const { fontName = null } = element || {};

  if (!fontName) return {};

  return typeof fontName === "object" && "family" in fontName
    ? { fontFamily: fontName.family }
    : {};
}

function getFontSizeCss(element: any) {
  const { fontSize = null } = element || {};

  if (!fontSize) return {};

  return { fontSize: `${String(fontSize)}px` };
}

function getLetterSpacingCss(element: any) {
  const { letterSpacing = null } = element || {};

  if (!letterSpacing) return {};
  return typeof letterSpacing === "object" && "value" in letterSpacing
    ? { letterSpacing: `${String(letterSpacing.value.toFixed(2))}px` }
    : {};
}

function getColorOrBackgroundCss(element: any, key: String) {
  const { fills = [] } = element || {};

  if (!fills.length) return {};

  let value = "";
  if (Array.isArray(fills) && fills.length > 0) {
    const fillColor = fills[0];
    if ("color" in fillColor && "opacity" in fillColor) {
      value = rgbToHex({
        ...fillColor.color,
        a: fillColor.opacity,
      });

      return { [`${key}`]: value };
    }
  }
  return {};
}

function getFontWeightCss(element: any) {
  const { fontWeight = null } = element || {};

  if (!fontWeight) return {};

  return { fontWeight: `${String(fontWeight)}` };
}

function getLineHeightCss(element: any) {
  const { lineHeight = null } = element || {};

  if (!lineHeight) return {};

  const unit = lineHeight.unit === "PERCENT" ? "%" : "px";

  return { lineHeight: `${String(lineHeight.value)}${unit}` };
}
function getBorderRadiusCss(node: any): { [key: string]: string } {
  const borderRadiusCss: { [key: string]: string } = {};
  if (
    "cornerRadius" in node &&
    typeof node.cornerRadius === "number" &&
    node.cornerRadius !== 0
  ) {
    const radiusValue = `${node.cornerRadius}px`;
    borderRadiusCss.borderTopLeftRadius = radiusValue;
    borderRadiusCss.borderTopRightRadius = radiusValue;
    borderRadiusCss.borderBottomLeftRadius = radiusValue;
    borderRadiusCss.borderBottomRightRadius = radiusValue;
  } else {
    if ("topLeftRadius" in node && typeof node.topLeftRadius === "number") {
      borderRadiusCss.borderTopLeftRadius = `${node.topLeftRadius}px`;
    }
    if ("topRightRadius" in node && typeof node.topRightRadius === "number") {
      borderRadiusCss.borderTopRightRadius = `${node.topRightRadius}px`;
    }
    if (
      "bottomLeftRadius" in node &&
      typeof node.bottomLeftRadius === "number"
    ) {
      borderRadiusCss.borderBottomLeftRadius = `${node.bottomLeftRadius}px`;
    }
    if (
      "bottomRightRadius" in node &&
      typeof node.bottomRightRadius === "number"
    ) {
      borderRadiusCss.borderBottomRightRadius = `${node.bottomRightRadius}px`;
    }
  }

  return borderRadiusCss;
}

function getWidthCss(element: any) {
  const { width = null } = element || {};

  if (!width) return {};

  return { width: `${String(width)}px` };
}

function getHeightCss(element: any) {
  const { height = null } = element || {};

  if (!height) return {};

  return { height: `${String(height)}px` };
}

function getBoxShadowCSS(element: any) {
  const { effects = null } = element || {};

  if (!effects?.length) return {};

  const boxShadow = effects
    .map((effect: any) => {
      const x = effect.offset?.x || 0;
      const y = effect.offset?.y || 0;
      const radius = effect?.radius || 0;
      const color = effect?.color ? rgbToHex(effect?.color) : "";

      // Return the individual shadow in CSS format
      return `${x}px ${y}px ${radius}px ${color}`;
    })
    .join(", ");

  return { boxShadow };
}

function getGapCss(element: any) {
  const { inferredAutoLayout = null } = element || {};

  if (!inferredAutoLayout && !("itemSpacing" in inferredAutoLayout)) return {};

  return { gap: `${inferredAutoLayout.itemSpacing}px` };
}

function getOpacityCss(element: any) {
  const { opacity = null } = element || {};

  if (!opacity) return {};

  return { opacity: `${String(opacity)}` };
}

export const styles = {
  getBordersCss,
  getPaddingCss,
  getFontFamilyCss,
  getBorderRadiusCss,
  getFontSizeCss,
  getLetterSpacingCss,
  getColorOrBackgroundCss,
  getFontWeightCss,
  getLineHeightCss,
  getWidthCss,
  getHeightCss,
  getBoxShadowCSS,
  getGapCss,
  getMarginCss,
  getOpacityCss,
};
