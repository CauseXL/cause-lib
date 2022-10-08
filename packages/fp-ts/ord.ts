import { Eq } from "./eq"

type Ordering = -1 | 0 | 1;

export interface Ord<T> extends Eq<T> {
  readonly compare: (a: T, b: T) =>  Ordering
}

declare const sort: <T>(O: Ord<T>) => <U extends T>(as: U[]) => U[];

interface User {
  name: string;
  age: number;
}

const equals = (a: User, b: User) => a.age === b.age
const compare = (a: User, b: User) => equals(a, b) ? 0 : a.age > b.age ? 1 : -1

const ordUser: Ord<User> = {
  equals: equals,
  compare: compare
}

const users = [
  {
    name: "Tomas",
    age: 25
  },
  {
    name: "Ammy",
    age: 21
  },
  {
    name: "Kat",
    age: 23
  }
]

sort(ordUser)(users)

type aa = typeof JSON.stringify
type bb = Parameters<aa>
