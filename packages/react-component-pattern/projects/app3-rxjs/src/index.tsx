import React from 'react';
import { render } from 'react-dom';
import { AppLinks } from './dev-tools/AppLinks';
import { Loading } from './dev-tools/Loading';
import { TodoApp } from './components/TodoApp';

render(
  <React.StrictMode>
    <>
      <AppLinks />

      <Loading />

      <TodoApp />
    </>
  </React.StrictMode>,
  document.querySelector('#root'),
);
