import type { FC } from 'react';
import React, { memo, useEffect } from 'react';
import { Provider } from 'react-redux';
import { apiAction, todoUIState } from '../data/state';
import { DevTab } from '../dev-tools/DevTab';
import { NewTodoBlock } from './NewTodoBlock';
import { StatusBar } from './StatusBar';
import './style-from-todo-mvc-website.css';
import './style-patch.css';
import { TodoList } from './TodoList';

// * ================================================================================

export const TodoApp: FC = memo(() => {
  return (
    <Provider store={todoUIState}>
      <DevTab />

      <TodoAppLayout />
    </Provider>
  );
});

// * ----------------------------------------------------------------

const TodoAppLayout: FC = memo(() => {
  useEffect(() => {
    apiAction.getTodos();
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
