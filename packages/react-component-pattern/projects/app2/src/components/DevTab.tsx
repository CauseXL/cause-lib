import { css } from '@emotion/css';
import type { FC } from 'react';
import React, { memo } from 'react';
import { apiCreateTodo, apiDeleteTodos, apiUpdateTodos } from '../data/api';
import { useTodoContext } from '../data/state';

// * ================================================================================

export const DevTab: FC = memo(() => {
  const {
    value: { todolist },
    refreshTodoFromServer,
  } = useTodoContext();
  return (
    <div
      className={css`
        position: fixed;
        left: 0;
        top: 0;
      `}
    >
      <LineButton
        onClick={async () => {
          await apiCreateTodo(Math.random().toString(36).slice(-6));
          refreshTodoFromServer();
        }}
      >
        create todo
      </LineButton>

      <LineButton
        onClick={async () => {
          if (!todolist.length) return;

          const modTodo = { ...todolist[todolist.length - 1] };
          modTodo.text = Math.random().toString(36).slice(-6);
          await apiUpdateTodos([modTodo]);
          refreshTodoFromServer();
        }}
      >
        patch last
      </LineButton>

      <LineButton
        onClick={async () => {
          if (!todolist.length) return;
          await apiDeleteTodos([todolist[todolist.length - 1].id]);
          refreshTodoFromServer();
        }}
      >
        delete last
      </LineButton>

      <LineButton
        onClick={async () => {
          if (!todolist.length) return;
          await apiDeleteTodos(todolist.map((e) => e.id));
          refreshTodoFromServer();
        }}
      >
        delete all
      </LineButton>
    </div>
  );
});

// * ----------------------------------------------------------------

const LineButton: FC<{ onClick: () => void }> = memo(({ onClick, children }) => {
  return (
    <div>
      <button
        className={css`
          cursor: pointer;
          border: 1px solid black;
          padding: 4px;
          margin: 4px;
          font-weight: bold;
        `}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
});
