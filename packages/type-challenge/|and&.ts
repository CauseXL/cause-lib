type Measure = { radius: number };
type Style = { color: string };

type Circle1 = Measure | Style;

type Circle2 = Measure & Style;

const circle_a: Circle1 = {
  radius: 10,
}

const circle_b: Circle1 = {
  radius: 10,
  color: "red",
}

// type error
const circle_aa: Circle2 = {
  radius: 10,
}

const circle_bb: Circle2 = {
  radius: 10,
  color: "red",
}

export {}
