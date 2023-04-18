import { observer } from 'mobx-react-lite';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { apiAction } from '../data/state';
import { DevTab } from '../dev-tools/DevTab';
import { NewTodoBlock } from './NewTodoBlock';
import { StatusBar } from './StatusBar';
import './style-from-todo-mvc-website.css';
import './style-patch.css';
import { TodoList } from './TodoList';

// * ================================================================================

export const TodoApp: FC = observer(() => {
  return (
    <>
      <DevTab />

      <TodoAppLayout />
    </>
  );
});

// * ----------------------------------------------------------------

const TodoAppLayout: FC = observer(() => {
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

const Title: FC = observer(() => {
  return <h1>todos</h1>;
});
