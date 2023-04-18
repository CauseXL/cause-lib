import { tap } from 'ramda';
import { simpleHttp } from '../utils/simpleHttp';

// * ================================================================================

type Id = string;

export interface TodoItem {
  id: Id;
  text: string;
  done: boolean;
}

// * ================================================================================

const dev_showLoading = () => {
  document.querySelector('.loading')?.classList.remove('hidden');
};

const dev_hideLoading = () => {
  document.querySelector('.loading')?.classList.add('hidden');
};

export const apiGetTodos = () => {
  dev_showLoading();
  return simpleHttp
    .get<TodoItem[]>(`http://localhost:5501/todolist`)
    .then(tap((e) => console.log('get todos', e)))
    .then(tap(dev_hideLoading));
};

export const apiCreateTodo = (text: string) => {
  dev_showLoading();
  return simpleHttp
    .post<TodoItem>(`http://localhost:5501/todolist`, { text, done: false })
    .then(tap((e) => console.log('create a new todo', text, e)))
    .then(tap(dev_hideLoading));
};

export const apiUpdateTodos = (todoPatch: ({ id: Id } & Partial<TodoItem>)[]) => {
  dev_showLoading();
  return simpleHttp
    .patch<TodoItem[]>(`http://localhost:5501/todolist`, todoPatch)
    .then(tap((e) => console.log('update a todo', todoPatch, e)))
    .then(tap(dev_hideLoading));
};

export const apiDeleteTodos = (ids: Id[]) => {
  dev_showLoading();
  return simpleHttp
    .delete<void>(`http://localhost:5501/todolist/${Array.isArray(ids) ? ids.join(',') : ids}`)
    .then(tap((e) => console.log('delete a todo', ids, e)))
    .then(tap(dev_hideLoading));
};
