import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Drink } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (drink: Drink, quantity?: number) => void;
  removeFromCart: (drinkId: string) => void;
  updateQuantity: (drinkId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (drink: Drink, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.drink.id === drink.id);
      if (existing) {
        return prev.map((item) =>
          item.drink.id === drink.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { drink, quantity }];
    });
  };

  const removeFromCart = (drinkId: string) => {
    setCart((prev) => prev.filter((item) => item.drink.id !== drinkId));
  };

  const updateQuantity = (drinkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(drinkId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.drink.id === drinkId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.drink.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
