import { useEffect } from 'react';
import { useLocation, Link } from 'react-router';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export function OurWork() {
    const { pathname } = useLocation();
    const { t } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-screen py-14 px-4">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold mb-2 text-primary">
                        {t('Como Funciona o Zé Birita')}
                    </h1>
                    <p className="text-muted-foreground">
                        {t('Descubra como levamos a sua bebida gelada até você!')}
                    </p>
                </motion.div>

                {/* Section: Processo de Pedido */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card border border-border rounded-xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">{t('Você receberá as bebidas exatamente assim...')}</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">1. {t('Bem frescas (geladas)!')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {t('Na temperatura ideal para consumo.')}
                            </p>
                            <img src="/assets/Heineken25clpack.jpg" alt="Bebida Gelada" className="h-85 w-full object-contain rounded-lg border border-border" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">2. {t('Tudo em um saco com gelo!')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {t('Garantindo que continuará frescas (geladas).')}
                            </p>
                            <img src="/assets/SuperBock25clpack.jpg" alt="Saco com Gelo" className="h-85 w-full object-contain rounded-lg border border-border" />
                        </div>
                        <div>
                        </div>
                    </div>
                </motion.div>

                {/* Section: Regras de Entrega */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-card border border-border rounded-xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4">{t('Regras de Entrega')}</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>
                            <span className="font-semibold text-foreground">{t('Portimão:')}</span> 1,00 €.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">{t('Alvor, Parchal e Ferragudo:')}</span> 3,00 €.
                        </li>
                        <li>
                            <span className="font-semibold text-foreground">{t('Demais localidades:')}</span> {t('O valor será informado mediante contacto pelo WhatsApp.')}
                        </li>
                    </ul>
                </motion.div>

                {/* Section: Localização */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-card border border-border rounded-xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4">{t('Onde Estamos')}</h2>
                    <a
                        href="https://maps.app.goo.gl/Jev5mAsnELuVCPSY9"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('Abrir localização do Zé Birita no Google Maps')}
                        className="block mb-4"
                    >
                        <img
                            src="/assets/localizacao.png"
                            alt={t('Localização física do Zé Birita')}
                            className="h-72 w-full object-cover rounded-lg border border-border"
                        />
                    </a>
                    <p className="text-muted-foreground mb-2">
                        {t('Telefone:')} <a href="tel:+351931835337" className="text-foreground hover:underline">(+351) 931 835 337</a>
                    </p>
                </motion.div>

                {/* Section: Horário de Funcionamento */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-xl p-6 mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4">{t('Horário de Funcionamento')}</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li><span className="font-semibold text-foreground">{t('Segunda-feira:')}</span> 12:00 às 00:00</li>
                                    <li><span className="font-semibold text-foreground">{t('Terça-feira:')}</span> {t('Fechado (Folga)')}</li>
                                    <li><span className="font-semibold text-foreground">{t('Quarta-feira:')}</span> 12:00 às 00:00</li>
                                    <li><span className="font-semibold text-foreground">{t('Quinta-feira:')}</span> 12:00 às 00:00</li>
                                    <li><span className="font-semibold text-foreground">{t('Sexta-feira:')}</span> 12:00 às 00:00</li>
                                    <li><span className="font-semibold text-foreground">{t('Sábado:')}</span> 12:00 às 00:00</li>
                                    <li><span className="font-semibold text-foreground">{t('Domingo:')}</span> 12:00 às 00:00</li>
                    </ul>
                </motion.div>

                <div className="flex justify-center mt-8 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/#products-section"
                            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-all shadow-lg shadow-primary/20"
                        >
                            {t('Nossa Seleção')}
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}