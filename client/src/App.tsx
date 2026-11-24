import { Route, Switch } from "wouter";
import Protected from "./_core/Protected";
import { CartProvider } from "./lib/cart";
import { Header, Footer } from "./components/Layout";
import { CartDrawer } from "./components/CartDrawer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";

export default function App() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/shop" component={Shop} />
            <Route path="/shop/:category" component={Shop} />
            <Route path="/product/:slug" component={ProductDetail} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/order/:orderNumber" component={OrderConfirmation} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/account">
              <Protected>
                <Account />
              </Protected>
            </Route>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/policies" component={Policies} />
            <Route>
              {() => (
                <div className="mx-auto max-w-xl px-6 py-32 text-center">
                  <p className="eyebrow">404</p>
                  <h1 className="mt-4 font-display text-4xl text-wine">This page has moved on</h1>
                  <p className="mt-4 text-sm font-light text-muted-foreground">
                    The link may be old. The collection is still here.
                  </p>
                  <a href="/shop" className="btn-wine mt-8 inline-flex">
                    Back to the Collection
                  </a>
                </div>
              )}
            </Route>
          </Switch>
        </div>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
