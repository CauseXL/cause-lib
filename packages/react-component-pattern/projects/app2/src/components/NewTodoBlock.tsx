import { css } from '@emotion/css';
import type { FC } from 'react';
import React, { memo, useState } from 'react';
import { apiCreateTodo, apiUpdateTodos } from '../data/api';
import { useTodoContext } from '../data/state';

// * ================================================================================

export const NewTodoBlock: FC = memo(() => {
  const {
    value: { filterMode, todolist, todoItems, doneItems },
    refreshTodoFromServer,
  } = useTodoContext();

  const hasTodos = todoItems.length > 0;
  const nextDoneValue = hasTodos ? true : false;

  const [newTodoText, setNewTodoText] = useState('');

  return (
    <div>
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label
        className={css`
          top: 14px !important;
          left: -6px !important;
          cursor: pointer;
          z-index: 9999999;
        `}
        htmlFor="toggle-all"
        onClick={async () => {
          await apiUpdateTodos(
            todolist.map((todo) => {
              const { id } = todo;
              return { id, done: nextDoneValue };
            }),
          );
          refreshTodoFromServer();
        }}
      >
        Mark all as complete
      </label>

      <input
        className="new-todo"
        placeholder="What needs to be done"
        value={newTodoText}
        onChange={(e) => {
          setNewTodoText(e.target.value);
        }}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            await apiCreateTodo(newTodoText);
            refreshTodoFromServer();

            setNewTodoText('');
          }
        }}
      />
    </div>
  );
});
