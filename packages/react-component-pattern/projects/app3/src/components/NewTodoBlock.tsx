import type { FC, KeyboardEvent } from 'react';
import React, { memo, useState } from 'react';
import { useTodoContext } from '../data/state';

// * ================================================================================

// * ---------------------------------------------------------------- NewTodoBlock

export const NewTodoBlock: FC = memo(() => {
  const { action } = useTodoContext();

  const [newTodoText, setNewTodoText] = useState('');

  // * ---------------- action

  const createNewTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      action.createTodo(newTodoText);

      setNewTodoText('');
    }
  };

  // * ---------------- render

  return (
    <div>
      <ToggleAll />

      <input
        className="new-todo"
        placeholder="What needs to be done"
        value={newTodoText}
        onChange={(e) => setNewTodoText(e.target.value)}
        onKeyDown={createNewTodo}
      />
    </div>
  );
});

// * ---------------------------------------------------------------- ToggleAll

const ToggleAll: FC = memo(() => {
  const {
    value: { todolist, remainItems },
    action,
  } = useTodoContext();

  // * ---------------- action

  const toggleAll = () => {
    const hasTodos = remainItems.length > 0;
    const nextDoneValue = hasTodos ? true : false;

    action.updateTodos(
      todolist.map((todo) => {
        const { id } = todo;
        return { id, done: nextDoneValue };
      }),
    );
  };

  // * ---------------- render

  return (
    <>
      <input id="toggle-all" className="toggle-all" type="checkbox" />
      <label htmlFor="toggle-all" onClick={toggleAll}>
        Mark all as complete
      </label>
    </>
  );
});
