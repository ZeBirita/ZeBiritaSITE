import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, Drink } from '../types';
import { drinks as staticDrinks } from '../data/drinks';
import { parseSheetsMenu } from '../data/sheetsMenu';
import { isWithinOpeningHours, WeeklyOpeningHours } from '../data/openingHours';

declare global {
  interface ImportMeta {
    readonly env: Record<string, string | undefined> & {
      readonly VITE_SHEETS_API_URL?: string;
    };
  }
}

type MenuSyncStatus = 'loading' | 'ready' | 'error';

interface CartContextType {
  cart: CartItem[];
  drinks: Drink[];
  availability: Record<string, boolean>;
  menuSyncStatus: MenuSyncStatus;
  menuSyncError: string | null;
  openingHours: WeeklyOpeningHours | null;
  isStoreOpen: boolean;
  hasLoadedMenu: boolean;
  addToCart: (drink: Drink, quantity?: number) => boolean;
  removeFromCart: (drinkId: string) => void;
  updateQuantity: (drinkId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [drinks, setDrinks] = useState(staticDrinks);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [menuSyncStatus, setMenuSyncStatus] = useState<MenuSyncStatus>('loading');
  const [menuSyncError, setMenuSyncError] = useState<string | null>(null);
  const [openingHours, setOpeningHours] = useState<WeeklyOpeningHours | null>(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [hasLoadedMenu, setHasLoadedMenu] = useState(false);
  const isStoreOpen = isWithinOpeningHours(openingHours, currentTime);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_SHEETS_API_URL?.trim();
    if (!apiUrl) {
      setMenuSyncError('Configure VITE_SHEETS_API_URL com a URL publicada do Apps Script.');
      setMenuSyncStatus('error');
      return;
    }

    const controller = new AbortController();
    let isSyncing = false;

    const syncMenu = async () => {
      if (isSyncing) return;
      isSyncing = true;

      try {
        const response = await fetch(apiUrl, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`A API do cardápio respondeu com HTTP ${response.status}.`);
        }

        const { products, openingHours: nextOpeningHours } = parseSheetsMenu(await response.json());
        const nextAvailability: Record<string, boolean> = {};
        const nextDrinks = staticDrinks.map((drink) => {
          const sheetItem = products.get(drink.id);
          if (!sheetItem) return drink;

          nextAvailability[drink.id] = sheetItem.available;
          return { ...drink, price: sheetItem.price };
        });

        setDrinks(nextDrinks);
        const currentDrinksById = new Map(nextDrinks.map((drink) => [drink.id, drink]));
        setCart((previousCart) => previousCart.map((item) => {
          const currentDrink = currentDrinksById.get(item.drink.id);
          return currentDrink ? { ...item, drink: currentDrink } : item;
        }));
        setAvailability(nextAvailability);
        setOpeningHours(nextOpeningHours);
        setHasLoadedMenu(true);
        setMenuSyncError(null);
        setMenuSyncStatus('ready');
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error('Falha ao sincronizar o cardápio com o Google Sheets:', error);
        setMenuSyncError(
          error instanceof Error
            ? error.message
            : 'Não foi possível sincronizar o cardápio com o Google Sheets.',
        );
        setMenuSyncStatus('error');
      } finally {
        isSyncing = false;
      }
    };

    void syncMenu();
    const refreshInterval = window.setInterval(() => {
      void syncMenu();
    }, 60_000);
    const refreshOnFocus = () => {
      if (document.visibilityState === 'visible') void syncMenu();
    };
    window.addEventListener('focus', refreshOnFocus);
    document.addEventListener('visibilitychange', refreshOnFocus);

    return () => {
      controller.abort();
      window.clearInterval(refreshInterval);
      window.removeEventListener('focus', refreshOnFocus);
      document.removeEventListener('visibilitychange', refreshOnFocus);
    };
  }, []);

  useEffect(() => {
    const clockInterval = window.setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => window.clearInterval(clockInterval);
  }, []);

  const addToCart = (drink: Drink, quantity: number = 1): boolean => {
    const currentDrink = drinks.find((item) => item.id === drink.id);
    if (
      menuSyncStatus !== 'ready' ||
      !currentDrink ||
      !isWithinOpeningHours(openingHours) ||
      availability[drink.id] === false
    ) {
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.drink.id === currentDrink.id);
      if (existing) {
        return prev.map((item) =>
          item.drink.id === currentDrink.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { drink: currentDrink, quantity }];
    });
    return true;
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
        drinks,
        availability,
        menuSyncStatus,
        menuSyncError,
        openingHours,
        isStoreOpen,
        hasLoadedMenu,
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
