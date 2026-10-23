import { motion } from 'motion/react';
import { Sparkles, Wine, ShieldCheck, Truck } from 'lucide-react';
import { drinks } from '../data/drinks';
import { Products } from './Products';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useLanguage } from '../context/LanguageContext';

export function Home() {
  const { pathname } = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (window.location.hash === "#products-section") {
      const el = document.getElementById("products-section");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  /*useEffect(() => {
    const intervalTime = 5000;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % drinks.length);
    }, intervalTime);
 
    return () => clearInterval(interval);
  }, [drinks]);*/

  return (
    <div id="home-section" className="min-h-screen">
      <section className="relative md:h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-primary/20" />
        {/* <div
          className="absolute inset-0 opacity-20 md:hidden"
          style={{
            backgroundImage: `url(${drinks[currentIndex]?.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 1s ease-in-out',
          }}
        /> */}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/assets/mascote.png" className="w-24 h-auto md:w-44 object-contain text-primary mx-auto mt-12 md:mb-1" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {t('Bebidas Zé Birita')}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed">
              {t('Bateu a sede? A gente resolve!')}<br />
              {t('Cerveja sempre gelada, com entrega rápida.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                key={"products"}
                href="#products-section"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg shadow-primary/20"
              >
                {t('Nossa Seleção')}
              </motion.a>
              <motion.div
                key={"our-work"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/OurWork" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg shadow-primary/20">
                  {t('Como Funciona')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-5 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Wine,
                title: t('Estoque Gelado'),
                description: t('As melhores cervejas, sempre bem geladas e prontas pra entrega'),
              },
              {
                icon: ShieldCheck,
                title: t('Pagamento Seguro'),
                description: t('Múltiplas opções de pagamento com total segurança'),
              },
              {
                icon: Truck,
                title: t('Entrega Rápida'),
                description: t('Receba seus pedidos com agilidade e cuidado'),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-2 text-center hover:border-primary/50 transition-colors"
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-4 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div id="products-section" className="mb-12">
            <Products />
          </div>

          {/* <div className="text-center mt-12">
            <Link to="/produtos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Ver Todos os Produtos
              </motion.button>
            </Link>
          </div> */}
        </div>
      </section>
    </div>
  );
}
