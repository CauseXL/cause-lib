import { cx } from '@emotion/css';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import type { FC } from 'react';
import React from 'react';
import { apiAction, FilterMode, remainItems, todoUIState } from '../data/state';

// * ================================================================================

// * ---------------------------------------------------------------- StatusBar

export const StatusBar: FC = observer(() => {
  const todolist = todoUIState.todolist;
  const remainCount = remainItems.get().length;

  // * ---------------- action

  const clearCompleted = () => {
    const ids = todolist.filter((e) => e.done).map((e) => e.id);
    if (ids.length === 0) return;
    apiAction.deleteTodos(ids);
  };

  // * ---------------- render

  const remainText = `${remainCount} ${remainCount === 1 ? 'item' : 'items'} left`;

  /**  */
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

const FilterButton: FC<{ target: FilterMode; text: string }> = observer(({ target, text }) => {
  const filterMode = todoUIState.filterMode;

  return (
    <li>
      <a
        className={cx({ selected: filterMode === target })}
        onClick={() => runInAction(() => (todoUIState.filterMode = target))}
      >
        {text}
      </a>
    </li>
  );
});
