import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import Products from "./components/product/Products";
import Auth from "./components/auth/Auth";
import NotFoundPage from "./components/NotFoundPage";
import PublicProfile from "./components/profile/PublicProfile";
import ResetPassword from "./components/auth/ResetPassword";
import { ModalMsgContextProvider } from "./context/ModalMsgContext";
import ModalMsg from "./components/UI/ModalMsg";
import UserChatsPage from "./components/chat/UserChatsPage";
import Chat from "./components/chat/Chat";
import AddProduct from "./components/product/AddProduct";
import UserProducts from "./components/product/UserProducts";
import ProductDetails from "./components/product/ProductDetails";
import MainNavbar from "./components/MainNavbar";
import EditProduct from "./components/product/EditProduct";
import EditProfile from "./components/profile/EditProfile";
import Footer from "./components/Footer";

function App() {
  return (
    <ModalMsgContextProvider>
      <Router>
        <MainNavbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login">
            <Auth view="login" />
          </Route>
          <Route path="/signup">
            <Auth view="signup" />
          </Route>
          <Route path="/profile" component={Profile} exact />
          <Route path="/chats" exact>
            <Profile tab="chats" exact />
          </Route>
          <Route path="/profile/edit" component={EditProfile} exact />

          <Route path="/add-product" component={AddProduct} exact />
          <Route path="/user-products" component={UserProducts} />
          <Route path="/edit-product" component={EditProduct} />
          <Route path="/product-info" component={ProductDetails} />
          {/* <Route path="/chats" component={UserChatsPage} exact /> */}
          <Route path="/chats/:name" component={Chat} />
          <Route path="/profile/:addr" component={PublicProfile} />
          <Route path="/search-results" component={Products} />
          <Route path="/reset_password">
            <ResetPassword reset={true} />
          </Route>
          <Route
            path="/reset_password_confirm/:token"
            component={ResetPassword}
          />
          <Route path="*" component={NotFoundPage} />
        </Switch>
        <Footer />
      </Router>
      <ModalMsg />
    </ModalMsgContextProvider>
  );
}

export default App;
