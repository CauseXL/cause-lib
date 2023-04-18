import { useObservableEagerState } from 'observable-hooks';
import type { FC, KeyboardEvent } from 'react';
import React, { memo, useState } from 'react';
import { apiAction, remainItems$, todoUIState$ } from '../data/state';

// * ================================================================================

// * ---------------------------------------------------------------- NewTodoBlock

export const NewTodoBlock: FC = memo(() => {
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

const ToggleAll: FC = memo(() => {
  const { todolist } = useObservableEagerState(todoUIState$);
  const remainItems = useObservableEagerState(remainItems$);

  const hasTodos = remainItems.length > 0;

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
