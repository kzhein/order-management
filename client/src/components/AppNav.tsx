import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const AppNav = () => {
  return (
    <Navbar bg='primary' variant='dark'>
      <Container>
        <Navbar.Brand>Orders Operation Portal</Navbar.Brand>
        <Nav className='ml-auto'>
          <LinkContainer to='/' activeClassName='active' exact>
            <Nav.Link>Create Order</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/orders' activeClassName='active' exact>
            <Nav.Link>All Orders</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default AppNav;
