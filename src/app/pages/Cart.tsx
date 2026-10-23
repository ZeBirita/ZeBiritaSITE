import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function Cart() {
  const { pathname } = useLocation();
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();
  const total = getTotal();
  const subtotal = total >= 10 ? 0 : 10 - total;
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">{t('Carrinho Vazio')}</h2>
          <p className="text-muted-foreground mb-8">
            {t('Adicione produtos para começar sua compra')}
          </p>
          <motion.a
            key={"products"}
            href="/#products-section"
            initial={{ scale: 1.05 }}
            animate={{ scale: 0.95 }}
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg shadow-primary/20"
          >
            {t('Explorar produtos')}
          </motion.a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-14 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-primary">
            {t('Carrinho de Compras')}
          </h1>
          <p className="text-muted-foreground">
            {cart.length} {t(cart.length !== 1 ? 'itens no carrinho' : 'item no carrinho')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.drink.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-card border border-border rounded-xl p-4 flex gap-4 max-[374px]:min-h-40"
              >
                <img
                  src={item.drink.image}
                  alt={item.drink.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <p className="hidden max-[374px]:block absolute text-xs text-muted-foreground mt-[6.5rem] ml-1 whitespace-nowrap">
                  {t('cada')} {item.drink.price.toFixed(2)} €
                </p>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t(item.drink.name.replaceAll('Combo', t('Combo')))}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.drink.volume} • {t(item.drink.origin)}
                  </p>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        updateQuantity(item.drink.id, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </motion.button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        updateQuantity(item.drink.id, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg bg-secondary hover:bg-primary/20 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="hidden max-[374px]:flex items-center gap-3 mt-2 text-left">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeFromCart(item.drink.id)}
                      className="shrink-0 text-destructive hover:text-destructive/80"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                    <p className="text-xl font-bold text-primary">
                      {(item.drink.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between max-[374px]:hidden">
                  <div>
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.drink.id)}
                        className="text-destructive hover:text-destructive/80"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                      <p className="text-sm text-muted-foreground">
                      {t('cada')} {item.drink.price.toFixed(2)} €
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      {(item.drink.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold mb-6">{t('Resumo do Pedido')}</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('Taxa de pedido mínimo')}</span>
                  <span className="text-primary">{subtotal == 0 ? t('Grátis') : `${subtotal.toFixed(2)} €`}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {(Number(subtotal) + Number(total)).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/checkout')}
                className="mb-5 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {t('Finalizar Compra')}
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/#products-section')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {t('Continuar Comprando')}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}