import { produce } from 'immer';
import React, { createContext, useContext, useState } from 'react';
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

type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export const TodoContext = createContext<UseState<TodoUIState> | null>(null);

export const useCreateTodoContextValue = () => useState(defaultTodoState);

export const useTodoContext = () => {
  const c = useContext(TodoContext);
  if (!c) {
    throw new Error('请在正确中使用 Context');
  }
  const [state, setState] = c;

  const setStateWithImmer = (updater: (state: TodoUIState) => any) => {
    setState((s) =>
      produce(s, (d) => {
        updater(d);

        // * ---------------- updateComputedCache

        const todolist = d.todolist;
        d.doneItems = todolist.filter((e) => e.done);
        d.remainItems = todolist.filter((e) => !e.done);
      }),
    );
  };

  const refreshTodosFromServer = () => {
    apiGetTodos().then((todolist) => setStateWithImmer((s) => (s.todolist = todolist)));
  };

  const apiWithUpdateState = <T extends unknown[]>(fn: (...arg: T) => void) => {
    return async (...arg: T) => {
      await fn(...arg);
      refreshTodosFromServer();
    };
  };

  return {
    value: state,
    setTodoUI: setStateWithImmer,

    action: {
      getTodos: refreshTodosFromServer,
      createTodo: apiWithUpdateState(apiCreateTodo),
      updateTodos: apiWithUpdateState(apiUpdateTodos),
      deleteTodos: apiWithUpdateState(apiDeleteTodos),
    },
  };
};
