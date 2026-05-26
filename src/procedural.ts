import type { ShapeType } from "./types";

// Generates a random set of coordinates or shapes following the design rules
export function generateProceduralSvg(
  shapeType: ShapeType,
  color: string,
  bgColor: string,
  complexity: number = 0.5, // Sliders map to customizable factors
  smoothness: number = 0.6,
  rotation: number = 0,
  scaleFactor: number = 0.85
): string {
  // Center is 250, 250. Dimensions are 500x500
  const cx = 250;
  const cy = 250;
  const size = 500;
  
  // Base bounding size for the shape (generally between 120 and 220 px radius)
  const baseRadius = 130 * scaleFactor;

  let pathData = "";

  // Helper to rotate a point (x, y) around (cx, cy)
  const rotatePoint = (x: number, y: number, angleDegrees: number): [number, number] => {
    const angleRad = (angleDegrees * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const dx = x - cx;
    const dy = y - cy;
    return [
      cx + dx * cos - dy * sin,
      cy + dx * sin + dy * cos
    ];
  };

  const actualType = shapeType === "random" 
    ? (["pebble", "arc", "drop", "circle"][Math.floor(Math.random() * 4)] as ShapeType)
    : shapeType;

  if (actualType === "circle" || actualType === "geometric") {
    // Generate an abstract oval/imperfect circle
    const rx = baseRadius * (1 + (complexity - 0.5) * 0.3);
    const ry = baseRadius * (0.8 + (smoothness - 0.5) * 0.4);
    
    // Draw using four bezier curves to support slight asymmetry or rotation
    const p1 = rotatePoint(cx, cy - ry, rotation);
    const p2 = rotatePoint(cx + rx, cy, rotation);
    const p3 = rotatePoint(cx, cy + ry, rotation);
    const p4 = rotatePoint(cx - rx, cy, rotation);

    const cp = 0.552284749831; // Standard circle bezier factor
    const c1r = rotatePoint(cx + rx * cp, cy - ry, rotation);
    const c1ld = rotatePoint(cx + rx, cy - ry * cp, rotation);
    const c2ru = rotatePoint(cx + rx, cy + ry * cp, rotation);
    const c2rd = rotatePoint(cx + rx * cp, cy + ry, rotation);
    const c3ld = rotatePoint(cx - rx * cp, cy + ry, rotation);
    const c3lu = rotatePoint(cx - rx, cy + ry * cp, rotation);
    const c4rd = rotatePoint(cx - rx, cy - ry * cp, rotation);
    const c4ru = rotatePoint(cx - rx * cp, cy - ry, rotation);

    pathData = `M ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ` +
               `C ${c1r[0].toFixed(1)} ${c1r[1].toFixed(1)}, ${c1ld[0].toFixed(1)} ${c1ld[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} ` +
               `C ${c2ru[0].toFixed(1)} ${c2ru[1].toFixed(1)}, ${c2rd[0].toFixed(1)} ${c2rd[1].toFixed(1)}, ${p3[0].toFixed(1)} ${p3[1].toFixed(1)} ` +
               `C ${c3ld[0].toFixed(1)} ${c3ld[1].toFixed(1)}, ${c3lu[0].toFixed(1)} ${c3lu[1].toFixed(1)}, ${p4[0].toFixed(1)} ${p4[1].toFixed(1)} ` +
               `C ${c4rd[0].toFixed(1)} ${c4rd[1].toFixed(1)}, ${c4ru[0].toFixed(1)} ${c4ru[1].toFixed(1)}, ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Z`;
  } 
  else if (actualType === "pebble" || actualType === "organic") {
    // Generate organic pebble shape by placing 6 vertices in a circle and smoothing them
    const points: [number, number][] = [];
    const count = 6;
    const variation = 40 * complexity; // how volatile the shape is

    // Unique offsets based on a deterministic mathematical seed using the properties
    const seed = (complexity * 13) + (smoothness * 7) + (rotation * 3);
    const pseudoRandom = (n: number) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      // Vary the radius at each point
      const variableRadius = baseRadius + (pseudoRandom(i) - 0.5) * variation;
      const rawX = cx + Math.cos(angle) * variableRadius;
      const rawY = cy + Math.sin(angle) * variableRadius;
      points.push(rotatePoint(rawX, rawY, rotation));
    }

    // Convert points to smooth closed Bezier loop (Catmull-rom style approximation)
    pathData = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} `;
    for (let i = 0; i < count; i++) {
      const pPrev = points[(i - 1 + count) % count];
      const pCurr = points[i];
      const pNext = points[(i + 1) % count];
      const pNextNext = points[(i + 2) % count];

      // Control points for bezier curve based on spline calculation
      const cp1x = pCurr[0] + (pNext[0] - pPrev[0]) * (smoothness * 0.25);
      const cp1y = pCurr[1] + (pNext[1] - pPrev[1]) * (smoothness * 0.25);
      const cp2x = pNext[0] - (pNextNext[0] - pCurr[0]) * (smoothness * 0.25);
      const cp2y = pNext[1] - (pNextNext[1] - pCurr[1]) * (smoothness * 0.25);

      pathData += `C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${pNext[0].toFixed(1)} ${pNext[1].toFixed(1)} `;
    }
    pathData += "Z";
  } 
  else if (actualType === "arc") {
    // Elegant arch with configurable width, curvature and thickness
    const archWidth = baseRadius * (1.3 + (complexity - 0.5) * 0.3);
    const archHeight = baseRadius * (1.5 + (smoothness - 0.5) * 0.4);
    const topRadius = archWidth / 2;

    const left = cx - topRadius;
    const right = cx + topRadius;
    const bottom = cy + archHeight / 2;
    const innerBottom = bottom;
    
    // thickness as percentage of width
    const thickness = topRadius * (0.6 + (complexity - 0.5) * 0.45);
    const innerLeft = left + thickness;
    const innerRight = right - thickness;
    const innerTop = bottom - archHeight + thickness;

    // Outer path
    const outerP1 = rotatePoint(left, bottom, rotation);
    const outerP2 = rotatePoint(left, bottom - archHeight + topRadius, rotation);
    const outerTopLeft = rotatePoint(left, bottom - archHeight, rotation);
    const outerTopRight = rotatePoint(right, bottom - archHeight, rotation);
    const outerP3 = rotatePoint(right, bottom - archHeight + topRadius, rotation);
    const outerP4 = rotatePoint(right, bottom, rotation);

    // Inner path
    const innerP4 = rotatePoint(innerRight, bottom, rotation);
    const innerP3 = rotatePoint(innerRight, innerTop + (topRadius - thickness), rotation);
    const innerTopRight = rotatePoint(innerRight, innerTop, rotation);
    const innerTopLeft = rotatePoint(innerLeft, innerTop, rotation);
    const innerP2 = rotatePoint(innerLeft, innerTop + (topRadius - thickness), rotation);
    const innerP1 = rotatePoint(innerLeft, bottom, rotation);

    // Generate accurate architectural arch path
    pathData = `M ${outerP1[0].toFixed(1)} ${outerP1[1].toFixed(1)} ` +
               `L ${outerP2[0].toFixed(1)} ${outerP2[1].toFixed(1)} ` +
               `C ${outerTopLeft[0].toFixed(1)} ${outerTopLeft[1].toFixed(1)}, ${outerTopRight[0].toFixed(1)} ${outerTopRight[1].toFixed(1)}, ${outerP3[0].toFixed(1)} ${outerP3[1].toFixed(1)} ` +
               `L ${outerP4[0].toFixed(1)} ${outerP4[1].toFixed(1)} ` +
               `L ${innerP4[0].toFixed(1)} ${innerP4[1].toFixed(1)} ` +
               `L ${innerP3[0].toFixed(1)} ${innerP3[1].toFixed(1)} ` +
               `C ${innerTopRight[0].toFixed(1)} ${innerTopRight[1].toFixed(1)}, ${innerTopLeft[0].toFixed(1)} ${innerTopLeft[1].toFixed(1)}, ${innerP2[0].toFixed(1)} ${innerP2[1].toFixed(1)} ` +
               `L ${innerP1[0].toFixed(1)} ${innerP1[1].toFixed(1)} Z`;
  } 
  else if (actualType === "drop") {
    // Liquid tear/drop shape
    const w = baseRadius * (1 + (complexity - 0.5) * 0.4);
    const h = baseRadius * (1.4 + (smoothness - 0.5) * 0.5);
    
    // Top point
    const topX = cx;
    const topY = cy - h;
    
    // Bottom bulb
    const bottomY = cy + h * 0.6;
    const pLeft = rotatePoint(cx - w, cy + h * 0.1, rotation);
    const pRight = rotatePoint(cx + w, cy + h * 0.1, rotation);
    const pBottom = rotatePoint(cx, bottomY, rotation);
    const pTop = rotatePoint(topX, topY, rotation);

    // Control points for droplet
    const cpTopLeft = rotatePoint(cx - w * 0.1, cy - h * 0.5, rotation);
    const cpLeftTop = rotatePoint(cx - w, cy - h * 0.2, rotation);
    
    const cpLeftBottom = rotatePoint(cx - w, cy + h * 0.5, rotation);
    const cpBottomLeft = rotatePoint(cx - w * 0.5, bottomY, rotation);
    
    const cpBottomRight = rotatePoint(cx + w * 0.5, bottomY, rotation);
    const cpRightBottom = rotatePoint(cx + w, cy + h * 0.5, rotation);
    
    const cpRightTop = rotatePoint(cx + w, cy - h * 0.2, rotation);
    const cpTopRight = rotatePoint(cx + w * 0.1, cy - h * 0.5, rotation);

    pathData = `M ${pTop[0].toFixed(1)} ${pTop[1].toFixed(1)} ` +
               `C ${cpTopLeft[0].toFixed(1)} ${cpTopLeft[1].toFixed(1)}, ${cpLeftTop[0].toFixed(1)} ${cpLeftTop[1].toFixed(1)}, ${pLeft[0].toFixed(1)} ${pLeft[1].toFixed(1)} ` +
               `C ${cpLeftBottom[0].toFixed(1)} ${cpLeftBottom[1].toFixed(1)}, ${cpBottomLeft[0].toFixed(1)} ${cpBottomLeft[1].toFixed(1)}, ${pBottom[0].toFixed(1)} ${pBottom[1].toFixed(1)} ` +
               `C ${cpBottomRight[0].toFixed(1)} ${cpBottomRight[1].toFixed(1)}, ${cpRightBottom[0].toFixed(1)} ${cpRightBottom[1].toFixed(1)}, ${pRight[0].toFixed(1)} ${pRight[1].toFixed(1)} ` +
               `C ${cpRightTop[0].toFixed(1)} ${cpRightTop[1].toFixed(1)}, ${cpTopRight[0].toFixed(1)} ${cpTopRight[1].toFixed(1)}, ${pTop[0].toFixed(1)} ${pTop[1].toFixed(1)} Z`;
  }

  // Returns fully validated raw SVG following exactly the user design constraints
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <rect width="500" height="500" fill="${bgColor}"/>
  <path d="${pathData}" fill="${color}" style="transition: fill 0.3s ease;"/>
</svg>`;

  return svg;
}
