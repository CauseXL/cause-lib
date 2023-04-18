import { cx } from '@emotion/css';
import { computed } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { apiAction, doneItems, remainItems, todoUIState } from '../data/state';
import { TodoItem } from '../data/types';

// * ================================================================================

// * ---------------------------------------------------------------- TodoList

export const TodoList: FC = observer(() => {
  const displayTodos = computed(() => {
    const { filterMode, todolist } = todoUIState;
    if (filterMode === 'REMAIN') return remainItems.get();
    if (filterMode === 'DONE') return doneItems.get();
    return todolist;
  }).get();

  return (
    <ul className="todo-list">
      {displayTodos.map((item) => (
        <TodoListItem key={item.id} item={item} />
      ))}
    </ul>
  );
});

// * ---------------------------------------------------------------- TodoListItem

const TodoListItem: FC<{ item: TodoItem }> = observer(({ item }) => {
  const { id, text, done } = item;

  const [localValue, setLocalValue] = useState('');
  const [editing, setEditing] = useState(false);

  // * ---------------- input auto focus effect

  const todoEditInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => todoEditInputRef.current?.focus(), [editing]);

  // * ---------------- action

  const updateTodoComplete = () => apiAction.updateTodos([{ id, done: !done }]);
  const deleteTodo = () => apiAction.deleteTodos([id]);

  const intoTextEditing = () => {
    setEditing(true);
    setLocalValue(text);
  };

  const exitTextEdition = () => {
    setEditing(false);
    if (localValue !== text) apiAction.updateTodos([{ id, text: localValue }]);
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
