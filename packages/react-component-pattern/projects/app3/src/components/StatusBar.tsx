import { cx } from '@emotion/css';
import type { FC } from 'react';
import React, { memo } from 'react';
import { FilterMode, useTodoContext } from '../data/state';

// * ================================================================================

// * ---------------------------------------------------------------- StatusBar

export const StatusBar: FC = memo(() => {
  const {
    value: { todolist, remainItems },
    action,
  } = useTodoContext();

  const remainCount = remainItems.length;

  // * ---------------- action

  const clearCompleted = () => {
    const ids = todolist.filter((e) => e.done).map((e) => e.id);
    if (ids.length === 0) return;
    action.deleteTodos(ids);
  };

  // * ---------------- render

  const remainText = `${remainCount} ${remainCount === 1 ? 'item' : 'items'} left`;

  return (
    <footer className="footer">
      <span className="todo-count">{remainText}</span>

      <ul className="filters">
        <FilterButton target="ALL" text="All" />
        <FilterButton target="REMAIN" text="Remain" />
        <FilterButton target="DONE" text="Completed" />
      </ul>

      <button className="clear-completed" onClick={clearCompleted}>
        Clear Completed
      </button>
    </footer>
  );
});

// * ---------------------------------------------------------------- FilterButton

const FilterButton: FC<{ target: FilterMode; text: string }> = memo(({ target, text }) => {
  const {
    value: { filterMode },
    setTodoUI,
  } = useTodoContext();

  return (
    <li>
      <a
        className={cx({ selected: filterMode === target })}
        onClick={() => setTodoUI((s) => (s.filterMode = target))}
      >
        {text}
      </a>
    </li>
  );
});
