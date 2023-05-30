export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type BoundingBox = Position & Size;

export const now = () => new Date().getTime();

export const rotatePosition = (
  position: Position,
  around: Position,
  radians: number,
) => {
  const {x, y} = position;
  const {x: cx, y: cy} = around;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - cx) + sin * (y - cy) + cx;
  const ny = cos * (y - cy) - sin * (x - cx) + cy;
  return {x: nx, y: ny};
};

export const center = (box: BoundingBox) => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});

export const addRadians = (value: number, add: number) => {
  const c = Math.PI * 2;
  return (c + value + add) % c;
};

export const getAngle = (center: Position, to: Position) =>
  Math.atan2(to.y - center.y, to.x - center.x);

export function must<T>(val: T | undefined | null, name?: string): T {
  if (val === undefined || val === null) {
    throw new Error(`assertion error: ${name ? name : 'val must be defined'}`);
  }
  return val;
}

export const randFloat = (min: number, max: number) =>
  Math.random() * (max - min) + min;

export const randInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min) + min);
};

export const randElm = <T>(arr: Readonly<T[]>) => arr[randInt(0, arr.length)];

export const randIndices = (count: number, max: number) => {
  const res: number[] = [];
  while (res.length < count) {
    for (;;) {
      const cand = randInt(0, max);
      if (!res.includes(cand)) {
        res.push(cand);
        break;
      }
    }
  }
  return res;
};

export const distance = (a: Position, b: Position): number => {
  const x = b.x - a.x;
  const y = b.y - a.y;
  return Math.sqrt(x * x + y * y);
};

export const getAbsoluteRect = (element: Element) => {
  const cr = element.getBoundingClientRect();
  return new Rect(
    cr.left + element.ownerDocument.documentElement.scrollLeft,
    cr.top + element.ownerDocument.documentElement.scrollTop,
    cr.width,
    cr.height,
  );
};

export class Rect {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) {}
  left() {
    return this.x;
  }
  top() {
    return this.y;
  }
  right() {
    return this.x + this.width;
  }
  bottom() {
    return this.y + this.height;
  }
}

export const simpleHash = (s: string) => {
  let hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
