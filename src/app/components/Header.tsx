import { ShoppingCart, Wine } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export function Header() {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const location = useLocation();
  const itemCount = getItemCount();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/#')}
              className="flex"
            >
              <img src="https://i.ibb.co/4Zhqj8wB/Logo-grande-BIRITA.avif" height={60} width={60} alt="Zé Birita Logo" />
              <div className="inline-block max-[439px]:hidden text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                <h1 className="text-xl font-bold text-primary">Zé Birita </h1>
                <p className="text-xs text-muted-foreground">{t('Delivery')}</p>
              </div>
            </motion.button>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <motion.a
                href="https://www.order.store/store/ze-birita/iRH6uteAVgG1x-BytF3OPg"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative group flex items-center justify-center"
              >
                <img src="/assets/UberEatsIcon.png" alt="Uber Eats" className="h-12 w-auto rounded" />
              </motion.a>
              <motion.button
                type="button"
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-8 w-14 items-center justify-center overflow-hidden rounded border border-primary/30"
                aria-label={language === 'pt' ? 'Switch to English' : 'Mudar para português'}
                title={language === 'pt' ? 'English' : 'Português'}
              >
                <img
                  src={language === 'pt' ? '/assets/flag-gb.svg' : '/assets/flag-pt.svg'}
                  alt={language === 'pt' ? 'English' : 'Português'}
                  className="h-full w-full object-cover"
                />
              </motion.button>
            </div>
            <Link to="/carrinho" className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/30"
              >
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span className="text-primary">{t('Carrinho')}</span>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
