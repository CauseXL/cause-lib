import type { FC } from 'react';
import React, { memo, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { apiCreateTodo, apiDeleteTodos, apiUpdateTodos, TodoItem } from './api';
import { TodoContext, useCreateTodoContextValue, useTodoContext } from './state';

// * ================================================================================

const App: FC = memo(() => {
  const todoContextValue = useCreateTodoContextValue();
  return (
    <>
      <ul>
        <li>
          <a href="http://localhost:3301/">app1-basic-logic-with-server</a>
        </li>
        <li>
          <a href="http://localhost:3302/">app2-basic-style-with-fake-api-delay</a>
        </li>
        <li>
          <a href="http://localhost:3303/">
            <b>app3-simply-organize-code</b>
          </a>
        </li>
        <li>
          <a href="http://localhost:3304/">
            <b>app3-redux</b>
          </a>
        </li>
        <li>
          <a href="http://localhost:3305/">
            <b>app3-mobx</b>
          </a>
        </li>
        <li>
          <a href="http://localhost:3306/">
            <b>app3-rxjs</b>
          </a>
        </li>
      </ul>

      <h1>App1</h1>

      <TodoContext.Provider value={todoContextValue}>
        <TodoLayout />
      </TodoContext.Provider>
    </>
  );
});

const TodoLayout: FC = memo(() => {
  const {
    value: { todolist },
    refreshTodoFromServer,
  } = useTodoContext();

  useEffect(() => {
    refreshTodoFromServer();
  }, []);

  // * ----------------

  return (
    <>
      <div>
        <DevTab />
        <Title />

        <NewTodoBlock />

        <TodoList />

        <StatusBar />
      </div>
    </>
  );
});

const DevTab: FC = memo(() => {
  const {
    value: { todolist },
    refreshTodoFromServer,
  } = useTodoContext();
  return (
    <div>
      <LineButton
        onClick={async () => {
          await apiCreateTodo(Math.random().toString(36).slice(-6));
          refreshTodoFromServer();
        }}
      >
        create todo
      </LineButton>

      <LineButton
        onClick={async () => {
          if (!todolist.length) return;

          const modTodo = { ...todolist[todolist.length - 1] };
          modTodo.text = Math.random().toString(36).slice(-6);
          await apiUpdateTodos([modTodo]);
          refreshTodoFromServer();
        }}
      >
        patch last
      </LineButton>

      <LineButton
        onClick={async () => {
          if (!todolist.length) return;
          await apiDeleteTodos([todolist[todolist.length - 1].id]);
          refreshTodoFromServer();
        }}
      >
        delete last
      </LineButton>

      <LineButton
        onClick={async () => {
          if (!todolist.length) return;
          await apiDeleteTodos(todolist.map((e) => e.id));
          refreshTodoFromServer();
        }}
      >
        delete all
      </LineButton>
    </div>
  );
});

const LineButton: FC<{ onClick: () => void }> = memo(({ onClick, children }) => {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
    </div>
  );
});

const Title: FC = memo(() => {
  return <span>todos</span>;
});

const NewTodoBlock: FC = memo(() => {
  const {
    value: { filterMode, todolist, todoItems, doneItems },
    refreshTodoFromServer,
  } = useTodoContext();

  const hasTodos = todoItems.length > 0;
  const nextDoneValue = hasTodos ? true : false;

  const [newTodoText, setNewTodoText] = useState('');

  return (
    <div>
      <button
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
        {hasTodos ? 'complete all' : 'undone all'}
      </button>
      <input
        placeholder="What needs to be done"
        value={newTodoText}
        onChange={(e) => {
          setNewTodoText(e.target.value);
        }}
        onKeyDown={async (e) => {
          if (e.key === 'Enter' && newTodoText.length) {
            await apiCreateTodo(newTodoText);
            refreshTodoFromServer();

            setNewTodoText('');
          }
        }}
      />
    </div>
  );
});

const TodoList: FC = memo(() => {
  const {
    value: { filterMode, todolist, todoItems, doneItems },
  } = useTodoContext();

  const displayTodos =
    filterMode === 'TODO' ? todoItems : filterMode === 'DONE' ? doneItems : todolist;

  return (
    <div>
      {displayTodos.map((item) => (
        <TodoListItem key={item.id} item={item} />
      ))}
    </div>
  );
});

const TodoListItem: FC<{ item: TodoItem }> = memo(({ item }) => {
  const { refreshTodoFromServer } = useTodoContext();

  return (
    <>
      <div>
        <button
          onClick={async () => {
            const { id, done } = item;
            await apiUpdateTodos([{ id, done: !done }]);
            refreshTodoFromServer();
          }}
        >
          {item.done ? 'done' : 'todo'}
        </button>
        {item.done ? <del>{item.text}</del> : <span>{item.text}</span>}
      </div>
    </>
  );
});

const StatusBar: FC = memo(() => {
  const {
    value: { todolist, todoItems },
    setTodoUI,
    refreshTodoFromServer,
  } = useTodoContext();

  const remainCount = todoItems.length;

  return (
    <>
      <div>
        <span>
          {remainCount} {remainCount === 1 ? 'item' : 'items'} left
        </span>

        <div>
          <button onClick={() => setTodoUI((s) => (s.filterMode = 'ALL'))}>All</button>
          <button onClick={() => setTodoUI((s) => (s.filterMode = 'TODO'))}>Todo</button>
          <button onClick={() => setTodoUI((s) => (s.filterMode = 'DONE'))}>Done</button>
        </div>

        <button
          onClick={async () => {
            await apiDeleteTodos(todolist.filter((e) => e.done).map((e) => e.id));
            refreshTodoFromServer();
          }}
        >
          Clear Completed
        </button>
      </div>
    </>
  );
});

// * ================================================================================

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root'),
);
