import { tap } from 'ramda';
import { hideLoading, showLoading } from '../dev-tools/LoadingUIAction';
import { simpleHttp } from '../utils/simpleHttp';

// * ================================================================================

type Id = string;

export interface TodoItem {
  id: Id;
  text: string;
  done: boolean;
}

// * ================================================================================

const wrap = <T extends unknown[], R>(fn: (...args: T) => Promise<R>) => {
  return (...args: T) => {
    showLoading();
    return fn(...args).then(tap(hideLoading));
  };
};

// * ----------------------------------------------------------------

export const apiGetTodos = wrap(() => {
  return simpleHttp
    .get<TodoItem[]>(`http://localhost:5501/todolist`)
    .then(tap((e) => console.log('get todos', e)));
});

export const apiCreateTodo = wrap((text: string) => {
  return simpleHttp
    .post<TodoItem>(`http://localhost:5501/todolist`, { text, done: false })
    .then(tap((e) => console.log('create a new todo', text, e)));
});

export const apiUpdateTodos = wrap((todoPatch: ({ id: Id } & Partial<TodoItem>)[]) => {
  return simpleHttp
    .patch<TodoItem[]>(`http://localhost:5501/todolist`, todoPatch)
    .then(tap((e) => console.log('update a todo', todoPatch, e)));
});

export const apiDeleteTodos = wrap((ids: Id[]) => {
  return simpleHttp
    .delete<void>(`http://localhost:5501/todolist/${Array.isArray(ids) ? ids.join(',') : ids}`)
    .then(tap((e) => console.log('delete a todo', ids, e)));
});
