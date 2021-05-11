import Home from "./components/Home";
import Profile from "./components/profile/Profile";
import Products from "./components/product/Products";
import Auth from "./components/auth/Auth";
import NotFoundPage from "./components/NotFoundPage";
import PublicProfile from "./components/profile/PublicProfile";
import ResetPassword from "./components/auth/ResetPassword";
import ModalMsg from "./components/UI/ModalMsg";
import Chat from "./components/chat/Chat";
import AddEditProduct from "./components/product/AddEditProduct";
import UserProducts from "./components/product/UserProducts";
import ProductDetails from "./components/product/ProductDetails";
import MainNavbar from "./components/MainNavbar";
import EditProfile from "./components/profile/EditProfile";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { lightTheme } from "./theme/theme";
import styled, { ThemeProvider } from "styled-components/macro";

const Filler = styled.div`
  visibility: hidden;
  flex: 1;
`;

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
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
          <Route path="/profile/edit/private">
            <EditProfile tab="private" />
          </Route>
          <Route path="/profile/edit/address">
            <EditProfile tab="address" />
          </Route>
          <Route path="/add-product" component={AddEditProduct} exact />
          <Route path="/edit-product/:productId" exact>
            <AddEditProduct editProduct />
          </Route>
          <Route path="/user-products" component={UserProducts} />
          <Route path="/product-info" component={ProductDetails} />
          <Route path="/chats/:name" component={Chat} />
          <Route path="/profile/:addr" component={PublicProfile} />
          <Route path="/search-results" component={Products} />
          <Route path="/reset-password">
            <ResetPassword reset={true} />
          </Route>
          <Route
            path="/reset-password-confirm/:token"
            component={ResetPassword}
          />
          <Route path="*" component={NotFoundPage} />
        </Switch>
        <Filler />
      </Router>
      <ModalMsg />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
