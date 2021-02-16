import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import Profile from "./components/Profile";
import Products from "./components/Products";
import Login from "./components/Login";
import ProductDetails from './components/ProductDetails'; 

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/profile" component={Profile} />
        <Route path="/buy" component={Products} />
        <Route path="/product-info" component={ProductDetails} />
      </Switch>
    </Router>
  );
}

export default App;
