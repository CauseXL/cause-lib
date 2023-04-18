import { produce } from 'immer';
import React, { createContext, useContext, useState } from 'react';
import { apiGetTodos, TodoItem } from './api';

// * ================================================================================

interface TodoUIState {
  filterMode: FilterMode;
  todolist: TodoItem[];

  // * ---------------- computed cache

  doneItems: TodoItem[];
  todoItems: TodoItem[];
}

type FilterMode = 'ALL' | 'TODO' | 'DONE';

const defaultTodoState: TodoUIState = {
  filterMode: 'ALL',
  todolist: [],
  doneItems: [],
  todoItems: [],
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
        d.todoItems = todolist.filter((e) => !e.done);
      }),
    );
  };

  return {
    value: state,
    setTodoUI: setStateWithImmer,
    refreshTodoFromServer: () => {
      apiGetTodos().then((todolist) => setStateWithImmer((s) => (s.todolist = todolist)));
    },
  };
};
