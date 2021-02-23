import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./pages/profile/Profile";
import Products from "./components/Products";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/profile/PublicProfile";
import ResetPassword from "./pages/ResetPassword";
import { ModalMsgContextProvider } from "./context/ModalMsgContext";
import ModalMsg from "./components/UI/ModalMsg";
import UserChats from "./pages/profile/UserChats";
import Chat from "./components/chat/Chat";

function App() {
  return (
    <ModalMsgContextProvider>
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
          <Route path="/profile/chats" component={UserChats} exact />
          <Route path="/profile/:addr" component={PublicProfile} />
          <Route path="/chat/:name" component={Chat} />
          <Route path="/buy" component={Products} />
          <Route path="/reset_password">
            <ResetPassword reset={true} />
          </Route>
          <Route
            path="/reset_password_confirm/:token"
            component={ResetPassword}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </Router>
      <ModalMsg />
    </ModalMsgContextProvider>
  );
}

export default App;
