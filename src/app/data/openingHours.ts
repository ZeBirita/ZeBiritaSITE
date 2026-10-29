export const weekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type Weekday = (typeof weekdays)[number];

export interface DailyOpeningHours {
  closed: boolean;
  opensAt: string | null;
  closesAt: string | null;
}

export type WeeklyOpeningHours = Record<Weekday, DailyOpeningHours>;

const weekdayAliases: Record<string, Weekday> = {
  segunda: 'monday',
  'segunda-feira': 'monday',
  monday: 'monday',
  terca: 'tuesday',
  'terca-feira': 'tuesday',
  tuesday: 'tuesday',
  quarta: 'wednesday',
  'quarta-feira': 'wednesday',
  wednesday: 'wednesday',
  quinta: 'thursday',
  'quinta-feira': 'thursday',
  thursday: 'thursday',
  sexta: 'friday',
  'sexta-feira': 'friday',
  friday: 'friday',
  sabado: 'saturday',
  saturday: 'saturday',
  domingo: 'sunday',
  sunday: 'sunday',
};

const weekdayNumbers: Record<string, Weekday> = {
  Mon: 'monday',
  Tue: 'tuesday',
  Wed: 'wednesday',
  Thu: 'thursday',
  Fri: 'friday',
  Sat: 'saturday',
  Sun: 'sunday',
};

export function parseWeeklyOpeningHours(payload: unknown): WeeklyOpeningHours {
  if (!Array.isArray(payload)) {
    throw new Error('Os horários devem ser enviados como uma lista.');
  }

  const schedule = {} as WeeklyOpeningHours;

  payload.forEach((row: unknown, index: number) => {
    if (typeof row !== 'object' || row === null) {
      throw new Error(`O horário na posição ${index + 1} é inválido.`);
    }

    const record = row as Record<string, unknown>;
    const dayName = normalizeDay(record.dia);
    const day = weekdayAliases[dayName];

    if (!day) {
      throw new Error(`O dia "${String(record.dia)}" não é válido.`);
    }
    if (schedule[day]) {
      throw new Error(`O dia "${String(record.dia)}" aparece mais de uma vez nos horários.`);
    }

    const closed = parseBoolean(record.fechado, index);
    if (closed) {
      schedule[day] = { closed: true, opensAt: null, closesAt: null };
      return;
    }

    const opensAt = parseTime(record.abertura, index);
    const closesAt = parseTime(record.fechamento, index);
    if (opensAt === closesAt) {
      throw new Error(`A abertura e o fechamento do dia ${String(record.dia)} não podem ser iguais.`);
    }

    schedule[day] = { closed: false, opensAt, closesAt };
  });

  const missingDays = weekdays.filter((day) => !schedule[day]);
  if (missingDays.length > 0) {
    throw new Error(`A agenda deve conter os sete dias da semana. Faltam: ${missingDays.join(', ')}.`);
  }

  return schedule;
}

export function isWithinOpeningHours(
  schedule: WeeklyOpeningHours | null,
  date: Date = new Date(),
): boolean {
  if (!schedule) return false;

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const currentDay = weekdayNumbers[values.weekday];
  if (!currentDay) return false;

  const currentMinutes = Number(values.hour) * 60 + Number(values.minute);
  const todayHours = schedule[currentDay];
  if (isOpenDuringDay(todayHours, currentMinutes)) return true;

  const previousDay = weekdays[(weekdays.indexOf(currentDay) + weekdays.length - 1) % weekdays.length];
  const previousHours = schedule[previousDay];
  if (previousHours.closed || !previousHours.opensAt || !previousHours.closesAt) return false;

  const previousOpen = toMinutes(previousHours.opensAt);
  const previousClose = toMinutes(previousHours.closesAt);
  return previousClose < previousOpen && currentMinutes < previousClose;
}

function isOpenDuringDay(hours: DailyOpeningHours, currentMinutes: number): boolean {
  if (hours.closed || !hours.opensAt || !hours.closesAt) return false;

  const opens = toMinutes(hours.opensAt);
  const closes = toMinutes(hours.closesAt);
  const effectiveClose = closes < opens ? closes + 24 * 60 : closes;
  return currentMinutes >= opens && currentMinutes < effectiveClose;
}

function normalizeDay(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .toLocaleLowerCase('pt-PT')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseBoolean(value: unknown, index: number): boolean {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  throw new Error(`O campo "fechado" na posição ${index + 1} deve ser 1, 0, true ou false.`);
}

function parseTime(value: unknown, index: number): string {
  if (typeof value !== 'string' || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.trim())) {
    throw new Error(`O horário na posição ${index + 1} deve usar o formato HH:mm.`);
  }
  return value.trim();
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
