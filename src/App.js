import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ActionForm } from './components/ActionForm';
import { ActionsTable } from './components/ActionsTable';
import {AdvisorTable} from './components/AdvisorTable';
import { NavBar } from './components/NavBar';
import { Scraper } from './components/Scraper';
import { CommunicationsTable } from './components/CommunicationsTable';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      
      <Router>
        <NavBar />
        <Container className='mt-30'>
        <Routes>
          <Route path="/" element={<CommunicationsTable />} />
          <Route path="/comunicaciones" element={<CommunicationsTable />} />
          <Route path="/asesores" element={<AdvisorTable />} />
          <Route path="/scraper" element={<Scraper />} />

          {/** 
          <Route path="/" element={<ActionsTable />} />
          <Route path="/acciones" element={<ActionsTable />} />
          <Route path="/acciones/nueva" element={<ActionForm />} />
          <Route path="/comunicaciones" element={<CommunicationsTable />} />
          <Route path="/asesores" element={<AdvisorTable />} />
          */}
        </Routes>
        </Container>
      </Router>
      

    </div>
  );
}

export default App;
