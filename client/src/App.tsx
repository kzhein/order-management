import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AppNav from './components/AppNav';
import AllOrdersPage from './pages/AllOrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import OrderPage from './pages/OrderPage';

function App() {
  return (
    <Router>
      <div className='App'>
        <AppNav />
        <Container>
          <Switch>
            <Route exact path='/' component={CreateOrderPage} />
            <Route exact path='/orders' component={AllOrdersPage} />
            <Route exact path='/orders/:id' component={OrderPage} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
