import type { FC } from 'react';
import React, { memo, useEffect } from 'react';
import { NewTodoBlock } from './NewTodoBlock';
import { StatusBar } from './StatusBar';
import { TodoList } from './TodoList';
import { TodoContext, useCreateTodoContextValue, useTodoContext } from '../data/state';
import { DevTab } from '../dev-tools/DevTab';
import './style-from-todo-mvc-website.css';
import './style-patch.css';

// * ================================================================================

export const TodoApp: FC = memo(() => {
  const todoContextValue = useCreateTodoContextValue();
  return (
    <TodoContext.Provider value={todoContextValue}>
      <DevTab />

      <TodoAppLayout />
    </TodoContext.Provider>
  );
});

// * ----------------------------------------------------------------

const TodoAppLayout: FC = memo(() => {
  const { action } = useTodoContext();

  useEffect(() => {
    action.getTodos();
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
