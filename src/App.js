import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./Login_&_Register/LoginPage";
import RegisterPage from "./Login_&_Register/RegisterPage";
import AddProduct from './Product/AddProduct';
import Index from './IndexFile/Index';
import Dashboard from './Dashboard';
import AddCategory from './Category/Add Category';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/log-in" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />

          <Route>
            <Index>
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/product" component={AddProduct} />
                <Route exact path="/category" component={AddCategory} />
              </Switch>
            </Index>
          </Route>
        </Switch>
      </Router>
    </>
  )
}

export default App;
