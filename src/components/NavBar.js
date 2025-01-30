import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const NavBar = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">              
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Flows" id="basic-nav-dropdown" >
              <NavDropdown.Item href="/acciones/nueva">Nuevo Flow</NavDropdown.Item>
              <NavDropdown.Item href="/acciones">Lista de Flows</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/broadcast" >Broadcast</Nav.Link>
            <Nav.Link href="/comunicaciones">Comunicaciones</Nav.Link>
            <Nav.Link href="/asesores">Asesores</Nav.Link> 
            <Nav.Link href="/scraper">Scraper</Nav.Link>     
            <Nav.Link href="/glosarioutm">Glosario UTM</Nav.Link> 
            <Nav.Link href="/logs">Logs</Nav.Link>     
            <Nav.Link href="/cotizacion">Cotización</Nav.Link>
            <Nav.Link href="/broadcastaction">Broadcast Action</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      
    </Navbar>
  );
}

