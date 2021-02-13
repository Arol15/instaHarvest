import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useContext } from "react";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import Profile from "./components/Profile";
import Products from './components/Products'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/signup" component={SignUp} />
        <Route path="/profile" component={Profile} />
        <Route path="/buy" component={Products} />
      </Switch>
    </Router>
  );
}

export default App;
