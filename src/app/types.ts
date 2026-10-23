import { CreditCard, Smartphone, Wallet } from "lucide-react";

export interface Drink {
  id: string;
  name: string;
  category: string | string[];
  price: number;
  image: string;
  description: string;
  volume: string;
  origin: string;
  rating: number;
  reviews: number;
  alcohol: string;
  featured?: boolean;
}

export interface CartItem {
  drink: Drink;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export type typePaymentMethod = 'cash' | 'mbway' | 'multibanco' | null;

export type Address = {
  street: string;
  number: string;
  complement: string | null;
  city: string;
  postalCode: string;
  coordinates: { lat: number; lng: number } | null;
};

export const newAddress: Address = {
  street: '',
  number: '',
  complement: null,
  city: '',
  postalCode: '',
  coordinates: null
}

export const PaymentMethods = [
  {
    id: 'mbway' as typePaymentMethod,
    name: 'MB Way',
    icon: Smartphone,
    description: 'MB Way será informado no WhatsApp'
  },
  {
    id: 'multibanco' as typePaymentMethod,
    name: 'Multibanco',
    icon: CreditCard,
    description: 'Pagamento na entrega'
  },
  {
    id: 'cash' as typePaymentMethod,
    name: 'Dinheiro',
    icon: Wallet,
    description: 'Pagamento na entrega'
  },
];

export const icone: Record<string, string> = {
  combo: '📦',
  cerveja: '🍺',
  vinho: '🍷',
  destilado: '🥃',
  whisky: '🥃',
  champagne: '🍾',
  vodka: '🍸',
  gin: '🍸',
  sidra: '🍏',
  tequila: '🍋‍🟩',
  refrigerante: '🥤',
  energetico: '⚡',
  suco: '🍹',
  agua: '💧'
};

export const categories = [
  { id: 'all', name: 'Todas', icon: '💠' },
  { id: 'combo', name: 'Combos', icon: '📦' },
  { id: 'cerveja', name: 'Cerveja', icon: '🍺' },
  { id: 'sidra', name: 'Sidra', icon: '🍏' },
  /*   { id: 'whisky', name: 'Whisky', icon: '🥃' }, */
  { id: 'vinho', name: 'Vinho', icon: '🍷' },
  { id: 'refrigerante', name: 'Refrigerante', icon: '🥤' },
  { id: 'energetico', name: 'Energético', icon: '⚡' },
  /*   { id: 'champagne', name: 'Champagne', icon: '🍾' }, */
  { id: 'vodka', name: 'Vodka', icon: '🍸' },
  { id: 'gin', name: 'Gin', icon: '🍸' },
  /*   { id: 'tequila', name: 'Tequila', icon: '🍋‍🟩' }, */
  /*   { id: 'suco', name: 'Sucos', icon: '🍹' }, */
  { id: 'agua', name: 'Água', icon: '💧' }
];