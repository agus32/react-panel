import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ActionForm } from './components/ActionForm';
import { ActionsTable } from './components/ActionsTable';
import {AdvisorTable} from './components/AdvisorTable';
import { NavBar } from './components/NavBar';
import { Scraper } from './components/Scraper';
import {BroadcastTable} from './components/BroadcastTable';
import { CommunicationsTable } from './components/CommunicationsTable';
import {GlossaryTable} from './components/GlossaryTable';
import { LogsTable } from './components/LogsTable';
import { Container } from 'react-bootstrap';
import { Cotizacion } from './components/Cotizacion';
import { BroadcastAction } from './components/BroadcastAction';

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
          <Route path="/acciones" element={<ActionsTable />} />
          <Route path="/acciones/nueva" element={<ActionForm />} />
          <Route path="/broadcast" element={<BroadcastTable />} />
          <Route path="/glosarioutm" element={<GlossaryTable />} />
          <Route path='/logs' element={<LogsTable/>} />
          <Route path='/cotizacion' element={<Cotizacion/>} />
          <Route path='/broadcastaction' element={<BroadcastAction/>} />

        </Routes>
        </Container>
      </Router>
      

    </div>
  );
}

export default App;
