import type { FC } from 'react';
import React, { memo, useEffect } from 'react';
import { DevTab } from './components/DevTab';
import { NewTodoBlock } from './components/NewTodoBlock';
import { StatusBar } from './components/StatusBar';
import { TodoList } from './components/TodoList';
import { TodoContext, useCreateTodoContextValue, useTodoContext } from './data/state';
import './style-from-todo-mvc-website.css';

// * ================================================================================

export const TodoApp: FC = memo(() => {
  const todoContextValue = useCreateTodoContextValue();
  return (
    <TodoContext.Provider value={todoContextValue}>
      <DevTab />

      <TodoLayout />
    </TodoContext.Provider>
  );
});

// * ----------------------------------------------------------------

const TodoLayout: FC = memo(() => {
  const { refreshTodoFromServer } = useTodoContext();

  useEffect(() => {
    refreshTodoFromServer();
  }, []);

  // * ----------------

  return (
    <div className="todoapp">
      <Title />
      <NewTodoBlock />
      <TodoList />
      <StatusBar />
    </div>
  );
});

const Title: FC = memo(() => {
  return <h1>todos</h1>;
});
