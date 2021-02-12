import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { useContext } from "react";
import Home from "./components/Home";
import SignUp from "./components/Signup";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        <Route path="/sign-up" component={SignUp} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
}

export default App;
