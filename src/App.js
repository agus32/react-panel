import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ActionForm } from './components/ActionForm';
import { ActionsTable } from './components/ActionsTable';
import { NavBar } from './components/NavBar';
import { CommunicationsTable } from './components/CommunicationsTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      {/** 
      <Router>
        <NavBar />
        <Container className='mt-30'>
        <Routes>
          <Route path="/" element={<ActionsTable />} />
          <Route path="/acciones" element={<ActionsTable />} />
          <Route path="/acciones/nueva" element={<ActionForm />} />
          <Route path="/comunicaciones" element={<CommunicationsTable />} />
        </Routes>
        </Container>
      </Router>*/}
      <CommunicationsTable />
    </div>
  );
}

export default App;
