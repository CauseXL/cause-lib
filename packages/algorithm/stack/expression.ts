const OPs = ["+", "-", "*", "/"] as const;
type OP = typeof OPs[number];

export const calExpression = (ex: string): number => {
  const numStack: number[] = [];
  const opStack: OP[] = [];
  for (let s of ex) {
    if (s === "(" || s === " ") {
      continue;
    } else if (s === ")") {
      const op = opStack.pop();
      const num1 = numStack.pop() || 0;
      const num2 = numStack.pop() || 0;
      let result = 0;
      if (op === "+") {
        result = num1 + num2;
      } else if (op === "-") {
        result = num1 - num2;
      } else if (op === "*") {
        result = num1 * num2;
      } else if (op === "/") {
        result = num1 / num2;
      }
      numStack.push(result);
    } else if (OPs.includes(s as OP)) {
      opStack.push(s as OP);
    } else {
      numStack.push(Number(s));
    }
  }
  return numStack.pop() || 0;
};

export const calExpression2 = (ex: string): string => {
  const numStack: string[] = [];
  const opStack: OP[] = [];
  for (let s of ex) {
    if (s === " ") {
      continue;
    } else if (s === ")") {
      const op = opStack.pop();
      const num1 = numStack.pop() || '';
      const num2 = numStack.pop() || '';
      let result = `(${num2} ${op} ${num1})`;
      numStack.push(result);
    } else if (OPs.includes(s as OP)) {
      opStack.push(s as OP);
    } else {
      numStack.push(s);
    }
  }
  return numStack.pop() || "";
};

export const isRightBracket = (input: string) => {
  let stack = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else {
      // if (stack.isEmpty()) {
      //   return false;
      // }
      const top = stack.pop();
      if (char === ")" && top !== "(") {
        return false;
      }
      if (char === "]" && top !== "[") {
        return false;
      }
      if (char === "}" && top !== "{") {
        return false;
      }
    }
  }
  return stack.length === 0;
};
