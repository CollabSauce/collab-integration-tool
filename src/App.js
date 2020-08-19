import React from 'react';

import './App.css';
import { DraggableToolbar } from 'src/components/DraggableToolbar';

function App() {
  return (
    <div className="App">
      <div className="App-body">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

      </div>
      <DraggableToolbar />
    </div>
  );
}

export default App;
