import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { categories } from '../types';
import { DrinkCard } from '../components/DrinkCard';
import { useLanguage } from '../context/LanguageContext';

export function Products() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState('featured');
  const {
    drinks,
    availability,
    menuSyncStatus,
    menuSyncError,
    isStoreOpen,
    hasLoadedMenu,
  } = useCart();
  const { t } = useLanguage();

  const filteredDrinks = drinks
    .filter((drink) => {
      const matchesCategory =
        selectedCategory === 'all' || (Array.isArray(drink.category) ? drink.category.includes(selectedCategory) : drink.category === selectedCategory);
      const matchesSearch = drink.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        drink.price >= priceRange[0] && drink.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          if (a.featured && !b.featured) {
            return -1;
          }
          if (!a.featured && b.featured) {
            return 1;
          }
          return Number(a.id) - Number(b.id);
      }
    });

  return (
    <div id="products-section" className="min-h-screen py-2 px-1">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-4xl font-bold mb-2 text-primary">
            {t('Nossa Seleção')}
          </h1>
          <p className="text-muted-foreground">
            {t('Explore nossa seleção e garanta sua bebida gelada.')}
          </p>
        </motion.div>

        <div className="mb-6 space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('Buscar bebidas...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
              />
            </div>
            {/* <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-input-background rounded-lg border border-border focus:border-primary outline-none transition-colors"
              >
                <option value="featured">Destaques</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliado</option>
                <option value="name">Nome A-Z</option>
              </select>
            </div> */}
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border hover:border-primary'
                  }`}
              >
                <span className="mr-2">{category.icon}</span>
                {t(category.name)}
              </motion.button>
            ))}
          </div>

          {/* <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <span className="font-semibold">Faixa de Preço</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                step=".5"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([0, parseFloat(e.target.value)])
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-32">
                Até {priceRange[1].toFixed(2)} € 
              </span>
            </div>
          </div> */}
        </div>

        {menuSyncStatus === 'loading' && (
          <div className="flex items-center justify-center gap-3 py-16 text-muted-foreground" role="status">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t('Sincronizando cardápio...')}
          </div>
        )}

        {menuSyncStatus === 'error' && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive" role="alert">
            <p className="font-semibold">{t('Não foi possível carregar o cardápio atualizado.')}</p>
            <p className="mt-1 text-sm">{menuSyncError}</p>
          </div>
        )}

        {menuSyncStatus === 'ready' && !isStoreOpen && (
          <div className="mb-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-foreground" role="status">
            {t('Estamos fora do horário de funcionamento. O cardápio continua disponível para consulta, mas não é possível adicionar produtos agora.')}
          </div>
        )}

        {hasLoadedMenu && (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">
                {t('Mostrando')} {filteredDrinks.length} {t(filteredDrinks.length === 1 ? 'produto' : 'produtos')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDrinks.map((drink, index) => (
                <motion.div
                  key={drink.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <DrinkCard
                    drink={drink}
                    isAvailable={availability[drink.id] !== false}
                    isStoreOpen={isStoreOpen}
                    canAddToCart={menuSyncStatus === 'ready' && isStoreOpen && availability[drink.id] !== false}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

        {hasLoadedMenu && filteredDrinks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {t('Nenhum produto encontrado com os filtros selecionados.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
