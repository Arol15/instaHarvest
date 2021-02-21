import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./pages/profile/Profile";
import Products from "./components/Products";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/profile/PublicProfile";
import ResetPassword from "./pages/ResetPassword";

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
        <Route path="/profile" component={Profile} exact />
        <Route path="/profile/:addr" component={PublicProfile} />
        <Route path="/buy" component={Products} />
        <Route path="/reset_password" exact>
          <ResetPassword />
        </Route>
        <Route path="/reset_password/:token">
          <ResetPassword confrim={true} />
        </Route>
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
