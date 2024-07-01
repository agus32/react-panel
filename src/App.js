import React from 'react';
import { ActionForm } from './components/ActionForm';
import { DataTable  } from './components/Table';
import {actions} from './config';

/*
function App() {
  return (
    <div className="App">
      <h1>Action Form</h1>
      <ActionForm actions={actions} />
    </div>
  );
}
*/
function App() {
  return (
    <div className="App">
      <h1>Lista</h1>
        <DataTable />
    </div>
  );
}

export default App;
