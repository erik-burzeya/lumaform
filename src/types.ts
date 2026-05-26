export type ShapeType = 'organic' | 'geometric' | 'pebble' | 'arc' | 'drop' | 'circle' | 'random';

export interface ColorPreset {
  name: string;
  nameDe: string;
  hex: string;
}

export interface ArtWork {
  id: string;
  svgCode: string;
  timestamp: string;
  source: 'Gemini AI' | 'Procedural Math';
  shapeType: ShapeType;
  colorName: string;
  colorHex: string;
  bgColor: string;
}

export const PASTEL_COLORS: ColorPreset[] = [
  { name: "Sage", nameDe: "Salbeigrün", hex: "#8F9E8B" },
  { name: "Terracotta", nameDe: "Terrakotta", hex: "#D98A6C" },
  { name: "Dusky Rose", nameDe: "Altrosa", hex: "#D4A3A3" },
  { name: "Mustard", nameDe: "Senfgelb", hex: "#E9C46A" },
  { name: "Warm Beige", nameDe: "Warmes Beige", hex: "#E7CBB1" },
  { name: "Eucalyptus", nameDe: "Dunkler Eukalyptus", hex: "#607A66" },
  { name: "Clay", nameDe: "Ziegelrot", hex: "#C27D68" },
  { name: "Almond", nameDe: "Mandelbraun", hex: "#D6C3B0" },
  { name: "Lavender", nameDe: "Lavendel", hex: "#BBA8BD" },
  { name: "Peach", nameDe: "Pfirsich", hex: "#E9B79B" }
];

export const BACKGROUND_COLORS = [
  { name: "Warm Off-White", hex: "#F9F6F0" },
  { name: "Soft Creme", hex: "#F4F0EA" },
  { name: "Gentle Ecru", hex: "#EFECE6" }
];
