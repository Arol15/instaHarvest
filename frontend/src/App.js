import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import Products from "./components/Products";
import Auth from "./components/auth/Auth";
import NotFoundPage from "./components/NotFoundPage";
import PublicProfile from "./components/profile/PublicProfile";
import ResetPassword from "./components/auth/ResetPassword";
import { ModalMsgContextProvider } from "./context/ModalMsgContext";
import ModalMsg from "./components/UI/ModalMsg";
import UserChatsPage from "./components/chat/UserChatsPage";
import Chat from "./components/chat/Chat";

function App() {
  return (
    <ModalMsgContextProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login">
            <Auth view="login" />
          </Route>
          <Route path="/signup">
            <Auth view="signup" />
          </Route>
          <Route path="/profile" component={Profile} exact />
          <Route path="/chats" component={UserChatsPage} exact />
          <Route path="/chats/:name" component={Chat} />
          <Route path="/profile/:addr" component={PublicProfile} />
          <Route path="/buy" component={Products} />
          <Route path="/reset_password">
            <ResetPassword reset={true} />
          </Route>
          <Route
            path="/reset_password_confirm/:token"
            component={ResetPassword}
          />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
      <ModalMsg />
    </ModalMsgContextProvider>
  );
}

export default App;
