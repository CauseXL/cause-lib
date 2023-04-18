import { produce } from 'immer';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { apiCreateTodo, apiDeleteTodos, apiGetTodos, apiUpdateTodos } from './api-server';
import { TodoItem } from './types';

// * ================================================================================

interface TodoUIState {
  filterMode: FilterMode;
  todolist: TodoItem[];
}

export type FilterMode = 'ALL' | 'REMAIN' | 'DONE';

// * ================================================================================

export const todoUIState$ = new BehaviorSubject<TodoUIState>({
  filterMode: 'ALL',
  todolist: [],
});

export const doneItems$ = todoUIState$.pipe(map((s) => s.todolist.filter((e) => e.done)));
export const remainItems$ = todoUIState$.pipe(map((s) => s.todolist.filter((e) => !e.done)));

export const setTodoUIState = (updater: (s: TodoUIState) => void) => {
  todoUIState$.next(
    produce(todoUIState$.getValue(), (d) => {
      updater(d);
    }),
  );
};

// * ================================================================================

const refreshTodosFromServer = () => {
  apiGetTodos().then((todolist) => setTodoUIState((s) => (s.todolist = todolist)));
};

const apiWithUpdateState = <T extends unknown[]>(fn: (...arg: T) => void) => {
  return async (...arg: T) => {
    await fn(...arg);
    refreshTodosFromServer();
  };
};

export const apiAction = {
  getTodos: refreshTodosFromServer,
  createTodo: apiWithUpdateState(apiCreateTodo),
  updateTodos: apiWithUpdateState(apiUpdateTodos),
  deleteTodos: apiWithUpdateState(apiDeleteTodos),
};
