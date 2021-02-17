import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useContext } from "react";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import Profile from "./pages/Profile";
import Products from "./components/Products";
import Login from "./components/Login";

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
      </Switch>
    </Router>
  );
}

export default App;
