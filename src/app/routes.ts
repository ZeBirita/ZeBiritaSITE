import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OurWork } from './pages/OurWork';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'produtos', Component: Products },
      { path: 'carrinho', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'OurWork', Component: OurWork },
    ],
  },
]);
