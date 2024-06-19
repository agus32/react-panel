import React from 'react';
import { ActionForm } from './components/ActionForm';
import {actions} from './config';


function App() {
  return (
    <div className="App">
      <h1>Action Form</h1>
      <ActionForm actions={actions} />
    </div>
  );
}

export default App;
