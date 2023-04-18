import { cx } from '@emotion/css';
import type { FC } from 'react';
import React, { memo, useEffect, useRef, useState } from 'react';
import { apiDeleteTodos, apiUpdateTodos, TodoItem } from '../data/api';
import { useTodoContext } from '../data/state';

// * ================================================================================

export const TodoList: FC = memo(() => {
  const {
    value: { filterMode, todolist, todoItems, doneItems },
  } = useTodoContext();

  const displayTodos =
    filterMode === 'REMAIN' ? todoItems : filterMode === 'DONE' ? doneItems : todolist;

  return (
    <ul className="todo-list">
      {displayTodos.map((item) => (
        <TodoListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

const TodoListItem: FC<{ item: TodoItem }> = memo(({ item }) => {
  const { id, text, done } = item;

  const { refreshTodoFromServer } = useTodoContext();

  const [editing, setEditing] = useState(false);

  const [localValue, setLocalValue] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [editing]);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <li
      className={cx({
        completed: item.done,
        editing,
      })}
    >
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={item.done}
          onChange={async () => {
            await apiUpdateTodos([{ id, done: !done }]);
            refreshTodoFromServer();
          }}
        />
        <label
          onDoubleClick={() => {
            setEditing(true);
            setLocalValue(text);
          }}
        >
          {item.text}
        </label>
        <button
          className="destroy"
          onClick={async () => {
            await apiDeleteTodos([item.id]);
            refreshTodoFromServer();
          }}
        />
      </div>
      <input
        ref={inputRef}
        className="edit"
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        onKeyDown={async (e) => {
          if (e.key === 'Enter') {
            setEditing(false);
            await apiUpdateTodos([{ id, text: localValue }]);
            refreshTodoFromServer();
          }
        }}
        onBlur={async () => {
          setEditing(false);
          await apiUpdateTodos([{ id, text: localValue }]);
          refreshTodoFromServer();
        }}
      />
    </li>
  );
});
