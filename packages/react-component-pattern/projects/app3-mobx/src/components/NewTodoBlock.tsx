import { observer } from 'mobx-react-lite';
import type { FC, KeyboardEvent } from 'react';
import React, { useState } from 'react';
import { apiAction, remainItems, todoUIState } from '../data/state';

// * ================================================================================

// * ---------------------------------------------------------------- NewTodoBlock

export const NewTodoBlock: FC = observer(() => {
  const [newTodoText, setNewTodoText] = useState('');

  // * ---------------- action

  const createNewTodo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      apiAction.createTodo(newTodoText);

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

const ToggleAll: FC = observer(() => {
  const todolist = todoUIState.todolist;
  const hasTodos = remainItems.get().length > 0;

  // * ---------------- action

  const toggleAll = () => {
    const nextDoneValue = hasTodos ? true : false;

    apiAction.updateTodos(
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
