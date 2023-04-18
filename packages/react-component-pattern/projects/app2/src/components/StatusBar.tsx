import { cx } from '@emotion/css';
import type { FC } from 'react';
import React, { memo } from 'react';
import { apiDeleteTodos } from '../data/api';
import { useTodoContext } from '../data/state';

// * ================================================================================

export const StatusBar: FC = memo(() => {
  const {
    value: { todolist, todoItems, filterMode },
    setTodoUI,
    refreshTodoFromServer,
  } = useTodoContext();

  const remainCount = todoItems.length;

  return (
    <footer className="footer">
      <span className="todo-count">
        {remainCount} {remainCount === 1 ? 'item' : 'items'} left
      </span>

      <ul className="filters">
        <li>
          <a
            className={cx({ selected: filterMode === 'ALL' })}
            onClick={() => setTodoUI((s) => (s.filterMode = 'ALL'))}
          >
            All
          </a>
        </li>
        <li>
          <a
            className={cx({ selected: filterMode === 'REMAIN' })}
            onClick={() => setTodoUI((s) => (s.filterMode = 'REMAIN'))}
          >
            Remain
          </a>
        </li>
        <li>
          <a
            className={cx({ selected: filterMode === 'DONE' })}
            onClick={() => setTodoUI((s) => (s.filterMode = 'DONE'))}
          >
            Completed
          </a>
        </li>
      </ul>

      <button
        className="clear-completed"
        onClick={async () => {
          const ids = todolist.filter((e) => e.done).map((e) => e.id);
          if (ids.length === 0) return;
          await apiDeleteTodos(ids);
          refreshTodoFromServer();
        }}
      >
        Clear Completed
      </button>
    </footer>
  );
});
