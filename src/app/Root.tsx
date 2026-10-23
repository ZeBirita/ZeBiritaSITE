import { Outlet } from 'react-router';
import { Header } from './components/Header';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'sonner';

export function Root() {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-20">
            <Outlet />
          </main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#141414',
                color: '#f5f5f5',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              },
            }}
          />
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
