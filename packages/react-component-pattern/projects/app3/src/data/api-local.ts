// * ================================================================================
import localforage from 'localforage';
import { tap } from 'ramda';
import { v4 } from 'uuid';
import { hideLoading, showLoading } from '../dev-tools/LoadingUIAction';
import { TodoItem } from './types';

// * ================================================================================

const rawGet = async () => {
  const todos = await localforage.getItem<TodoItem[]>('todoapp');
  if (todos === null) {
    await localforage.setItem<TodoItem[]>('todoapp', []);
    return [];
  } else {
    return todos;
  }
};

const rawSet = (todos: TodoItem[]) => localforage.setItem('todoapp', todos);

// * ------------------------------------------------

const waiting = () => {
  const random = (a: number, b: number) => Math.random() * (b - a) + a;
  const delay = random(200, 500);
  return new Promise((res) => setTimeout(res, delay));
};

const wrap = <T extends unknown[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T) => {
    showLoading();
    await waiting();
    return fn(...args).then(tap(hideLoading));
  };
};

// * ================================================================================

type Id = string;

// * ----------------

export const apiGetTodos = wrap(async () => {
  const todos = await rawGet();

  console.log('get todos', todos);
  return todos;
});

// * ----------------

export const apiCreateTodo = wrap(async (text: string) => {
  const todos = await rawGet();

  const newTodo = { id: v4(), text, done: false };
  todos.push(newTodo);

  await rawSet(todos);
  console.log('create a new todo', text, newTodo);
  return newTodo;
});

// * ----------------

export const apiUpdateTodos = wrap(async (todoPatch: ({ id: Id } & Partial<TodoItem>)[]) => {
  const todos = await rawGet();

  const updateAndResult = todoPatch
    .filter((e) => e.id)
    .map((todo) => {
      const { id } = todo;
      const targetTodo = todos.find((e) => e.id === id);
      Object.assign(targetTodo, todo);
      return targetTodo;
    });

  await rawSet(todos);
  console.log('update a todo', todoPatch, updateAndResult);

  return updateAndResult;
});

// * ----------------

export const apiDeleteTodos = wrap(async (ids: Id[]) => {
  const todos = await rawGet();

  const nextTodos = todos.filter((e) => !ids.includes(e.id));

  await rawSet(nextTodos);

  console.log('delete a todo', ids, nextTodos);
  return nextTodos;
});
