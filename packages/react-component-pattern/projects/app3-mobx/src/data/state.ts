import { computed, observable, runInAction } from 'mobx';
import { apiCreateTodo, apiDeleteTodos, apiGetTodos, apiUpdateTodos } from './api-server';
import { TodoItem } from './types';

// * ================================================================================

interface TodoUIState {
  filterMode: FilterMode;
  todolist: TodoItem[];
}

export type FilterMode = 'ALL' | 'REMAIN' | 'DONE';

// * ================================================================================

export const todoUIState = observable<TodoUIState>({
  filterMode: 'ALL',
  todolist: [],
});

export const doneItems = computed(() => todoUIState.todolist.filter((e) => e.done));
export const remainItems = computed(() => todoUIState.todolist.filter((e) => !e.done));

// * ================================================================================

const refreshTodosFromServer = () => {
  apiGetTodos().then((todolist) => runInAction(() => (todoUIState.todolist = todolist)));
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
