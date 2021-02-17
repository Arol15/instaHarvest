import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./pages/Profile";
import Products from "./components/Products";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route path="/login" component={Login} /> */}
        {/* <Route path="/signup" component={SignUp} /> */}
        <Route path="/login">
          <Auth view="login" />
        </Route>
        <Route path="/signup">
          <Auth view="signup" />
        </Route>
        <Route path="/profile" component={Profile} />
        <Route path="/buy" component={Products} />
      </Switch>
    </Router>
  );
}

export default App;
