import { cx } from '@emotion/css';
import type { FC } from 'react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useTodoContext } from '../data/state';
import { TodoItem } from '../data/types';

// * ================================================================================

// * ---------------------------------------------------------------- TodoList

export const TodoList: FC = memo(() => {
  const {
    value: { filterMode, todolist, remainItems, doneItems },
  } = useTodoContext();

  const displayTodos =
    filterMode === 'REMAIN' ? remainItems : filterMode === 'DONE' ? doneItems : todolist;

  return (
    <ul className="todo-list">
      {displayTodos.map((item) => (
        <TodoListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

// * ---------------------------------------------------------------- TodoListItem

const TodoListItem: FC<{ item: TodoItem }> = memo(({ item }) => {
  const { id, text, done } = item;
  const { action } = useTodoContext();

  const [localValue, setLocalValue] = useState('');
  const [editing, setEditing] = useState(false);

  // * ---------------- input auto focus effect

  const todoEditInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => todoEditInputRef.current?.focus(), [editing]);

  // * ---------------- action

  const updateTodoComplete = () => action.updateTodos([{ id, done: !done }]);
  const deleteTodo = () => action.deleteTodos([id]);

  const intoTextEditing = () => {
    setEditing(true);
    setLocalValue(text);
  };

  const exitTextEdition = () => {
    setEditing(false);
    if (localValue !== text) action.updateTodos([{ id, text: localValue }]);
  };

  // * ---------------- render

  return (
    <li className={cx({ completed: done, editing })}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={done} onChange={updateTodoComplete} />

        <label onDoubleClick={intoTextEditing}>{text}</label>

        <button className="destroy" onClick={deleteTodo} />
      </div>

      <input
        ref={todoEditInputRef}
        className="edit"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && exitTextEdition()}
        onBlur={exitTextEdition}
      />
    </li>
  );
});
