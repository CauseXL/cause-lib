import { css } from '@emotion/css';
import { useObservableEagerState } from 'observable-hooks';
import type { FC } from 'react';
import React, { memo } from 'react';
import { apiAction, todoUIState$ } from '../data/state';

// * ================================================================================

// * ---------------------------------------------------------------- DevTab

export const DevTab: FC = memo(() => {
  const { todolist } = useObservableEagerState(todoUIState$);

  // * -------------------------------- action

  const fastCreateTodo = () => apiAction.createTodo(Math.random().toString(36).slice(-6));

  // * ----------------

  const updateLastTodo = () => {
    if (!todolist.length) return;

    const modTodo = { ...todolist[todolist.length - 1] };
    modTodo.text = Math.random().toString(36).slice(-6);
    apiAction.updateTodos([modTodo]);
  };

  // * ----------------

  const deleteLastTodo = () => {
    if (!todolist.length) return;
    apiAction.deleteTodos([todolist[todolist.length - 1].id]);
  };

  // * ----------------

  const deleteAllTodos = () => {
    if (!todolist.length) return;
    apiAction.deleteTodos(todolist.map((e) => e.id));
  };

  // * -------------------------------- render

  return (
    <div
      className={css`
        position: fixed;
        left: 0;
        top: 0;
      `}
    >
      <LineButton onClick={fastCreateTodo}>Create Todo</LineButton>
      <LineButton onClick={updateLastTodo}>Update Last</LineButton>
      <LineButton onClick={deleteLastTodo}>delete last</LineButton>
      <LineButton onClick={deleteAllTodos}>delete all</LineButton>
    </div>
  );
});

// * ---------------------------------------------------------------- LineButton

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
