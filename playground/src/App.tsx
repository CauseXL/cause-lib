import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { compiler } from '@cause_xl/compiler';

const TEST_LSP = "(add 2 (subtract 4 2))";

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>origin: {TEST_LSP}</p>
        <p>result: {code}</p>
        <p>
          <button onClick={() => setCode(compiler(TEST_LSP))}>compiler</button>
        </p>
      </header>
      <div></div>
    </div>
  );
}

export default App
