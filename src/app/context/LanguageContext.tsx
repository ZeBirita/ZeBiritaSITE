import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'pt' | 'en';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const translations: Record<string, string> = {
  'Carrinho': 'Cart',
  'Delivery': 'Delivery',
  'Bebidas Zé Birita': 'Zé Birita Drinks',
  'Bateu a sede? A gente resolve!': 'Thirsty? We have you covered!',
  'Cerveja sempre gelada, com entrega rápida.': 'Always cold beer, delivered fast.',
  'Nossa Seleção': 'Our Selection',
  'Como Funciona': 'How It Works',
  'Estoque Gelado': 'Cold Stock',
  'As melhores cervejas, sempre bem geladas e prontas pra entrega': 'The best beers, always chilled and ready for delivery',
  'Pagamento Seguro': 'Secure Payment',
  'Múltiplas opções de pagamento com total segurança': 'Multiple payment options with complete security',
  'Entrega Rápida': 'Fast Delivery',
  'Receba seus pedidos com agilidade e cuidado': 'Receive your orders quickly and with care',
  'Explore nossa seleção e garanta sua bebida gelada.': 'Explore our selection and get your drink chilled.',
  'Buscar bebidas...': 'Search drinks...',
  'Todas': 'All',
  'Combo': 'Pack',
  'Combos': 'Packs',
  'Cerveja': 'Beer',
  'Sidra': 'Cider',
  'Vinho': 'Wine',
  'Refrigerante': 'Soft Drink',
  'Energético': 'Energy Drink',
  'Águas': 'Water',
  'Água': 'Water',
  'Água - 50cl': 'Water - 50cl',
  'Água - 1.5L': 'Water - 1.5L',
  'Adicionar': 'Add',
  'Adicionar 10x': 'Add 10x',
  'Destaque': 'Featured',
  'Carrinho Vazio': 'Empty Cart',
  'Adicione produtos para começar sua compra': 'Add products to start shopping',
  'Explorar produtos': 'Explore products',
  'Carrinho de Compras': 'Shopping Cart',
  'item no carrinho': 'item in cart',
  'itens no carrinho': 'items in cart',
  'cada': 'each',
  'Resumo do Pedido': 'Order Summary',
  'Taxa de pedido mínimo': 'Minimum order fee',
  'Taxa de entrega': 'Delivery fee',
  'Pendente': 'Pending',
  'Grátis': 'Free',
  'Finalizar Compra': 'Checkout',
  'Continuar Comprando': 'Continue Shopping',
  'Finalizar': 'Checkout',
  'Finalizar pedido': 'Place order',
  'Mostrando': 'Showing',
  'produto': 'product',
  'produtos': 'products',
  'Nenhum produto encontrado com os filtros selecionados.': 'No products found with the selected filters.',
  'Como Funciona o Zé Birita': 'How Zé Birita Works',
  'Descubra como levamos a sua bebida gelada até você!': 'Discover how we bring your chilled drink to you!',
  'Você receberá as bebidas exatamente assim...': 'Your drinks will arrive exactly like this...',
  'Bem frescas (geladas)!': 'Really fresh (chilled)!',
  'Na temperatura ideal para consumo.': 'At the ideal drinking temperature.',
  'Tudo em um saco com gelo!': 'Everything in an ice bag!',
  'Garantindo que continuará frescas (geladas).': 'Keeping them fresh (chilled).',
  'Regras de Entrega': 'Delivery Rules',
  'Portimão:': 'Portimão:',
  'Alvor, Parchal e Ferragudo:': 'Alvor, Parchal and Ferragudo:',
  'Demais localidades:': 'Other locations:',
  'O valor será informado mediante contacto pelo WhatsApp.': 'The price will be provided via WhatsApp contact.',
  'Horário de Funcionamento': 'Opening Hours',
  'Onde Estamos': 'Where We Are',
  'Abrir localização do Zé Birita no Google Maps': 'Open Zé Birita location in Google Maps',
  'Localização física do Zé Birita': 'Zé Birita physical location',
  'Telefone:': 'Phone:',
  'Fechado (Folga)': 'Closed (Day off)',
  'Endereço:': 'Address:',
  'Forma de Pagamento': 'Payment Method',
  'Detalhes do Pagamento': 'Payment Details',
  'O pagamento será efetuado em dinheiro no momento da entrega.': 'Payment will be made in cash upon delivery.',
  'Preciso de troco?': 'Do you need change?',
  'Sim': 'Yes',
  'Não': 'No',
  'Troco para quanto ?': 'Change for how much?',
  'Valor mínimo cobrado:': 'Minimum amount charged:',
  'Processando...': 'Processing...',
  'Confirmar via WhatsApp': 'Confirm via WhatsApp',
  'Você será redirecionado para o WhatsApp para confirmar seu pedido': 'You will be redirected to WhatsApp to confirm your order',
  'Preencha os dados de entrega e escolha a forma de pagamento': 'Fill in your delivery details and choose a payment method',
  'Entrega': 'Delivery',
  'Usar Minha Localização': 'Use My Location',
  'Obtendo...': 'Getting...',
  'Por favor, preencha o endereço de entrega para continuar.': 'Please fill in the delivery address to continue.',
  'Por favor, selecione uma forma de pagamento para continuar.': 'Please select a payment method to continue.',
  'Por favor, insira um valor para troco ou selecione "Não" para troco.': 'Please enter a change amount or select "No" for change.',
  'Localização obtida com sucesso!': 'Location obtained successfully!',
  'Permissão negada. Preencha manualmente.': 'Permission denied. Fill it in manually.',
  'Localização indisponível. Preencha manualmente.': 'Location unavailable. Fill it in manually.',
  'Tempo esgotado. Tente novamente.': 'Timed out. Please try again.',
  'Não foi possível obter sua localização.': 'Could not get your location.',
  'Pedido confirmado! Redirecionando para o WhatsApp...': 'Order confirmed! Redirecting to WhatsApp...',
  'Taxa pedido mínimo': 'Minimum order fee',
  'Troco a receber': 'Change to receive',
  'MB Way será informado no WhatsApp': 'MB Way details will be provided on WhatsApp',
  'Pagamento na entrega': 'Payment upon delivery',
  'Dinheiro': 'Cash',
  'Multibanco': 'Credit Card',
  'Ex: Rua das cervejas, Ed. Vista Mar': 'E.g. Beer Street, Sea View Building',
  'Número': 'Number',
  'Código Postal *': 'Postal Code *',
  'Segunda-feira:': 'Monday:',
  'Terça-feira:': 'Tuesday:',
  'Quarta-feira:': 'Wednesday:',
  'Quinta-feira:': 'Thursday:',
  'Sexta-feira:': 'Friday:',
  'Sábado:': 'Saturday:',
  'Domingo:': 'Sunday:',
  'adicionado ao carrinho!': 'added to cart!',
  'adicionados ao carrinho!': 'added to cart!',
  'Holanda': 'Netherlands',
  'Dinamarca': 'Denmark',
  'Estados Unidos': 'United States',
  'Áustria': 'Austria',
  'Rússia': 'Russia',
  'Inglaterra': 'England',
  'Rússia e Estados Unidos': 'Russia and the United States',
  'Inglaterra e Estados Unidos': 'England and the United States',
  'Uma cerveja holandesa famosa por sua qualidade e sabor refrescante.': 'A famous Dutch beer known for its quality and refreshing taste.',
  'Cerveja portuguesa famosa do tipo lager, conhecida por ser refrescante.': 'A famous Portuguese lager known for being refreshing.',
  'Cerveja portuguesa famosa de cor dourada, clara e com sabor equilibrado.': 'A famous Portuguese beer with a clear golden colour and balanced taste.',
  'Equilíbrio entre a doçura e a acidez da maçã verde, com notas florais.': 'A balance of green apple sweetness and acidity, with floral notes.',
  'Refrigerante característico, doce com notas de especiarias.': 'A distinctive soft drink, sweet with notes of spice.',
  'Refrigerante de baixa caloria, formulado para manter o sabor clássico da Coca-Cola original, mas sem açúcar.': 'A low-calorie soft drink with the classic Coca-Cola taste, but without sugar.',
  'Refrigerante característico, sabor cítrico marcante e baixo teor de açúcar ideal para matar a sede.': 'A distinctive soft drink with a bold citrus flavour and low sugar, ideal for quenching your thirst.',
  'Bebida energética levemente gaseificada, famosa pela sua fórmula revigorante e sabor marcante que te dá asas.': 'A lightly carbonated energy drink famous for its revitalizing formula and distinctive taste that gives you wings.',
  'Bebida energética gaseificada conhecida pelo seu sabor intenso, doce e refrescante.': 'A carbonated energy drink known for its intense, sweet and refreshing taste.',
  'Bebida energética zero açúcar e baixa caloria, com sabor cítrico leve, refrescante e menos doce que a linha tradicional': 'A zero-sugar, low-calorie energy drink with a light citrus flavour, refreshing and less sweet than the original range.',
  'Bebida energética com sabor marcante de suco de manga.': 'A carbonated drink with a bold mango juice flavour.',
  'Vinho branco fresco, vibrante e aromático com marcantes notas de frutas cítricas.': 'A fresh, vibrant and aromatic white wine with bold citrus fruit notes.',
  'Vinho tinto vibrante e expressivo, com notas marcantes e acidez elegante.': 'A vibrant and expressive red wine with bold notes and elegant acidity.',
  'Água mineral Penacova natural sem gás.': 'Natural still Penacova mineral water.',
  'Combo com 15 garrafas de Heineken - 25cl cada.': 'A Pack with 15 bottles of Heineken, 25cl each.',
  'Combo com 15 garrafas de Super Bock - 25cl cada.': 'A Pack with 15 bottles of Super Bock, 25cl each.',
  'Combo com 15 garrafas de Sagres - 25cl cada.': 'A Pack with 15 bottles of Sagres, 25cl each.',
  'Combo com 15 garrafas de Somersby - 20cl cada.': 'A Pack with 15 bottles of Somersby, 20cl each.',
  'Garrafa de Vodka Smirnoff - 70cl': 'Bottle of Smirnoff Vodka - 70cl',
  'Garrafa de Gin Gordons - 70cl': 'Bottle of Gordons Gin - 70cl',
  'Combo: Uma garrafa de Vodka Smirnoff - 70cl + dois energéticos Monster 50cl de sua escolha + um Refrigerante Sprite 2 litros': 'Combo: One bottle of Smirnoff Vodka - 70cl + two Monster energy drinks 50cl of your choice + one 2-litre Sprite',
  'Combo: Uma garrafa de Gin Gordons - 70cl + dois energéticos Monster 50cl de sua escolha + um Refrigerante Sprite 2 litros': 'Combo: One bottle of Gordons Gin - 70cl + two Monster energy drinks 50cl of your choice + one 2-litre Sprite',
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return window.localStorage.getItem('ze-birita-language') === 'en' ? 'en' : 'pt';
  });

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem('ze-birita-language', nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'pt-PT';
  }, [language]);

  const t = (text: string) => language === 'en' ? translations[text] ?? text : text;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}