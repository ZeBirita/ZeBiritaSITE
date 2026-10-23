import { ShoppingCart, Star, X } from 'lucide-react';
import { Drink } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';

interface DrinkCardProps {
  drink: Drink;
}

export function DrinkCard({ drink }: DrinkCardProps) {
  const { addToCart } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsExpanded(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const handleAddToCart = () => {
    addToCart(drink);
    toast.success(`${drink.name} ${t('adicionado ao carrinho!')}`, {
      duration: 2000,
    });
  };

  const handleAddToCart10 = () => {
    addToCart(drink, 10);
    toast.success(`10x ${drink.name} ${t('adicionados ao carrinho!')}`, {
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-card border border-border rounded-xl overflow-hidden group h-full flex flex-col"
    >
      <div className="relative h-80 overflow-hidden bg-secondary">
        <img
          src={drink.image}
          alt={drink.name}
          onClick={() => setIsExpanded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') setIsExpanded(true);
          }}
          className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-500"
        />
        {drink.featured && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
            {t('Destaque')}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      {isExpanded && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalhes de ${drink.name}`}
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-card shadow-2xl"
            onClick={() => setIsExpanded(false)}
          >
            <button
              type="button"
              aria-label="Fechar detalhes"
              onClick={() => setIsExpanded(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={drink.image}
              alt={drink.name}
              className="max-h-[65vh] w-full object-contain"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-foreground">{t(drink.name.replaceAll('Combo', t('Combo')))}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {drink.volume} • {t(drink.origin)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {t(drink.description)}
              </p>
              <span className="mt-4 block text-xl font-bold text-primary sm:text-2xl">
                {drink.price.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>,
        document.body,
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors min-h-[2rem] line-clamp-2 sm:line-clamp-2">
              {t(drink.name.replaceAll('Combo', t('Combo')))}
            </h3>
            <p className="text-xs text-muted-foreground">
              {drink.volume} • {t(drink.origin)}
            </p>
          </div>
        </div>

        <p className="hidden sm:block text-sm text-muted-foreground mb-3 min-h-[50px] line-clamp-2">
          {t(drink.description)}
        </p>

        {/*         <div className="flex flex-col sm:flex-row items-start justify-between mb-2 gap-2 sm:gap-0 pt-2 pb-2">
          <div className="flex gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {drink.rating}
            </span>
          </div>
          <span className="hidden sm:block text-xs text-muted-foreground">
            ({drink.reviews} avaliações)
          </span>
        </div> */}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mt-auto">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {drink.price.toFixed(2)} €
            </span>
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90 
                 text-primary-foreground 
                 px-2 py-1 rounded-lg flex items-center justify-center gap-1 text-xs
                 sm:px-4 sm:py-2 sm:gap-2 sm:text-sm
                 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">{t('Adicionar')}</span>
            </motion.button>

            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart10}
              className="bg-secondary hover:bg-secondary/80 
                 text-secondary-foreground border border-border
                 px-2 py-1 rounded-lg flex items-center justify-center gap-1 text-xs
                 sm:px-4 sm:py-2 sm:gap-2 sm:text-sm
                 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">{t('Adicionar 10x')}</span>
            </motion.button> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
