import { rgbToHex } from "./rgbToHex";

type Color = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type Offset = {
  x: number;
  y: number;
};

type ShadowEffect = {
  offset?: Offset;
  radius?: number;
  color?: Color;
};

export function generateBoxShadowCSS(shadowEffects: ShadowEffect[]): string {
  return shadowEffects
    .map((effect) => {
      const x = effect.offset?.x || 0;
      const y = effect.offset?.y || 0;
      const radius = effect?.radius || 0;
      const color = effect?.color ? rgbToHex(effect?.color) : "";

      // Return the individual shadow in CSS format
      return `${x}px ${y}px ${radius}px ${color}`;
    })
    .join(", ");
}
