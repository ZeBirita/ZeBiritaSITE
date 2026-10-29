import { parseWeeklyOpeningHours, WeeklyOpeningHours } from './openingHours';

export interface SheetMenuItem {
  available: boolean;
  price: number;
}

export interface SheetsMenuResponse {
  products: Map<string, SheetMenuItem>;
  openingHours: WeeklyOpeningHours;
}

export function parseSheetsMenu(payload: unknown): SheetsMenuResponse {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('A API do cardápio deve retornar um objeto com produtos e horários.');
  }

  const response = payload as Record<string, unknown>;
  if (!Array.isArray(response.produtos)) {
    throw new Error('A API do cardápio deve incluir a lista "produtos".');
  }

  const products = new Map<string, SheetMenuItem>();

  response.produtos.forEach((row: unknown, index: number) => {
    if (typeof row !== 'object' || row === null) {
      throw new Error(`O produto na posição ${index + 1} é inválido.`);
    }

    const record = row as Record<string, unknown>;
    const id = typeof record.id === 'string' || typeof record.id === 'number'
      ? String(record.id).trim()
      : '';
    const available = parseAvailability(record.disponivel);
    const price = parsePrice(record.preco);

    if (!id) {
      throw new Error(`O produto na posição ${index + 1} não possui um ID válido.`);
    }
    if (products.has(id)) {
      throw new Error(`A API retornou o ID duplicado "${id}".`);
    }

    products.set(id, { available, price });
  });

  return {
    products,
    openingHours: parseWeeklyOpeningHours(response.horarios),
  };
}

function parseAvailability(value: unknown): boolean {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  throw new Error('A disponibilidade deve ser 1, 0, true ou false.');
}

function parsePrice(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().replace(',', '.');
    if (/^\d+(\.\d{1,2})?$/.test(normalized)) {
      const price = Number(normalized);
      if (Number.isFinite(price)) return price;
    }
  }

  throw new Error('O preço deve ser um número válido com vírgula ou ponto decimal.');
}
