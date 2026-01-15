import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './lib/auth';
import { CartProvider } from './lib/cart';
import { Toaster } from './components/ui/toaster';
import './index.css';

import Home from './pages/home';
import Shop from './pages/shop';
import About from './pages/about';
import Cart from './pages/cart';
import Login from './pages/login';
import Signup from './pages/signup';
import NotFound from './pages/not-found';

import Dashboard from './pages/account/dashboard';
import ProfileSettings from './pages/account/profile';
import OrderHistory from './pages/account/orders';
import OrderTracking from './pages/account/tracking';
import Wishlist from './pages/account/wishlist';
import AddressBook from './pages/account/addresses';
import PaymentMethods from './pages/account/payment';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/about" component={About} />
      <Route path="/cart" component={Cart} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      <Route path="/account" component={Dashboard} />
      <Route path="/account/profile" component={ProfileSettings} />
      <Route path="/account/orders" component={OrderHistory} />
      <Route path="/account/tracking" component={OrderTracking} />
      <Route path="/account/wishlist" component={Wishlist} />
      <Route path="/account/addresses" component={AddressBook} />
      <Route path="/account/payment" component={PaymentMethods} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
