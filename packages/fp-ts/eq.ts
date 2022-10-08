export interface Eq<T> {
  readonly equals: (x: T, y: T) => boolean;
}

interface Point {
  x: number;
  y: number;
}

const equals = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

const eqPoint: Eq<Point> = {
  equals
}

type Elem<T> = (E: Eq<T>) => {
  (a: T): (as: Array<T>) => boolean;
  (a: T, as: Array<T>): boolean;
}

// * ------------------------ declare const
declare const elem: <T>(E: Eq<T>) => {
  (a: T): (as: Array<T>) => boolean;
  (a: T, as: Array<T>): boolean;
}

// const elem = <T>(E: Eq<T>) => (a: T) => (as: Array<T>) => false;

const points: Array<Point> = [
  { x: 1, y: 2 },
  { x: 2, y: 2 },
  { x: 3, y: 4 },
];

elem(eqPoint)({ x: 1, y: 2 })(points)

// const elem