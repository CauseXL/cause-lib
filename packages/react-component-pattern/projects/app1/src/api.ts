import { tap } from 'ramda';
import { simpleHttp } from './simpleHttp';

// * ================================================================================

type Id = string;

export interface TodoItem {
  id: Id;
  text: string;
  done: boolean;
}

// * ================================================================================

export const apiGetTodos = () => {
  return simpleHttp
    .get<TodoItem[]>(`http://localhost:5501/todolist`)
    .then(tap((e) => console.log('get todos', e)));
};

export const apiCreateTodo = (text: string) => {
  return simpleHttp
    .post<TodoItem>(`http://localhost:5501/todolist`, { text, done: false })
    .then(tap((e) => console.log('create a new todo', text, e)));
};

export const apiUpdateTodos = (todoPatch: ({ id: Id } & Partial<TodoItem>)[]) => {
  return simpleHttp
    .patch<TodoItem[]>(`http://localhost:5501/todolist`, todoPatch)
    .then(tap((e) => console.log('update a todo', todoPatch, e)));
};

export const apiDeleteTodos = (ids: Id[]) => {
  return simpleHttp
    .delete<void>(`http://localhost:5501/todolist/${Array.isArray(ids) ? ids.join(',') : ids}`)
    .then(tap((e) => console.log('delete a todo', ids, e)));
};
