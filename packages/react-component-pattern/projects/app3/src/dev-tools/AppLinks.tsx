import type { FC } from 'react';
import React, { memo } from 'react';

export const AppLinks: FC = memo(() => {
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

      <h1>App3 with Context</h1>
    </>
  );
});
