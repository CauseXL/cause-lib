import { produce } from 'immer';
import { useSelector } from 'react-redux';
import { createStore } from 'redux';
import { apiCreateTodo, apiDeleteTodos, apiGetTodos, apiUpdateTodos } from './api-server';
import { TodoItem } from './types';

// * ================================================================================

interface TodoUIState {
  filterMode: FilterMode;
  todolist: TodoItem[];

  // * ---------------- computed cache

  doneItems: TodoItem[];
  remainItems: TodoItem[];
}

export type FilterMode = 'ALL' | 'REMAIN' | 'DONE';

const defaultTodoState: TodoUIState = {
  filterMode: 'ALL',
  todolist: [],
  doneItems: [],
  remainItems: [],
};

// * ================================================================================

export const todoUIState = createStore<
  TodoUIState,
  { type: string; payload: TodoUIState },
  unknown,
  unknown
>((s, a) => a.payload ?? defaultTodoState);

export const useTodoUIState = <T>(selector: (s: TodoUIState) => T) =>
  useSelector<TodoUIState>(selector) as T;

export const setTodoUIState = (updater: (s: TodoUIState) => void) => {
  const nextState = produce(todoUIState.getState(), (d) => {
    updater(d);

    // * ---------------- updateComputedCache

    const todolist = d.todolist;
    d.doneItems = todolist.filter((e) => e.done);
    d.remainItems = todolist.filter((e) => !e.done);
  });

  todoUIState.dispatch({ type: '', payload: nextState });
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
