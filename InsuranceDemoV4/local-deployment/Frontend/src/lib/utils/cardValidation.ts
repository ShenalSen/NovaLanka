/* ── Card network definitions ── */

export type CardType =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'diners'
  | 'jcb'
  | '';

export interface CardConfig {
  type: CardType;
  label: string;
  icon: string;           // emoji / svg placeholder used in selector
  regex: RegExp;          // validates the FULL raw number (no spaces)
  lengths: number[];      // valid digit counts
  groups: number[];       // grouping for display formatting e.g. [4,4,4,4]
  cvvLength: number;
}

export const CARD_CONFIGS: CardConfig[] = [
  {
    type:      'visa',
    label:     'Visa',
    icon:      '💳',
    regex:     /^4\d{12}(\d{3})?(\d{3})?$/,
    lengths:   [13, 16, 19],
    groups:    [4, 4, 4, 4],
    cvvLength: 3,
  },
  {
    type:      'mastercard',
    label:     'Mastercard',
    icon:      '💳',
    regex:     /^(5[1-5]\d{14}|2(2[2-9]\d{12}|[3-6]\d{13}|7[01]\d{12}|720\d{12}))$/,
    lengths:   [16],
    groups:    [4, 4, 4, 4],
    cvvLength: 3,
  },
  {
    type:      'amex',
    label:     'Amex',
    icon:      '💳',
    regex:     /^3[47]\d{13}$/,
    lengths:   [15],
    groups:    [4, 6, 5],
    cvvLength: 4,
  },
  {
    type:      'discover',
    label:     'Discover',
    icon:      '💳',
    regex:     /^6(011|5\d{2}|4[4-9]\d)\d{12}$/,
    lengths:   [16],
    groups:    [4, 4, 4, 4],
    cvvLength: 3,
  },
  {
    type:      'diners',
    label:     'Diners Club',
    icon:      '💳',
    regex:     /^3(0[0-5]|[68]\d)\d{11}$/,
    lengths:   [14],
    groups:    [4, 6, 4],
    cvvLength: 3,
  },
  {
    type:      'jcb',
    label:     'JCB',
    icon:      '💳',
    regex:     /^35(2[89]|[3-8]\d)\d{12}$/,
    lengths:   [16],
    groups:    [4, 4, 4, 4],
    cvvLength: 3,
  },
];

/* ── Helpers ── */

export const getCardConfig = (type: CardType): CardConfig | undefined =>
  CARD_CONFIGS.find(c => c.type === type);

/** Max raw digits for a given card type */
export const maxDigits = (type: CardType): number => {
  const cfg = getCardConfig(type);
  if (!cfg) return 16;
  return Math.max(...cfg.lengths);
};

/** Max input length including spaces */
export const maxInputLength = (type: CardType): number => {
  const cfg = getCardConfig(type);
  if (!cfg) return 19;
  const digits = Math.max(...cfg.lengths);
  const spaces = cfg.groups.length - 1;
  return digits + spaces;
};

/**
 * Format a raw digit string into spaced groups for the selected card type.
 */
export const formatCardNumber = (raw: string, type: CardType): string => {
  const cfg = getCardConfig(type);
  const groups = cfg?.groups ?? [4, 4, 4, 4];
  const max    = maxDigits(type);
  const digits = raw.replace(/\D/g, '').slice(0, max);

  const parts: string[] = [];
  let offset = 0;
  for (const size of groups) {
    if (offset >= digits.length) break;
    parts.push(digits.slice(offset, offset + size));
    offset += size;
  }
  return parts.join(' ');
};

/**
 * Validate a raw card number string against the selected card type regex.
 * Returns true if valid.
 */
export const isValidCardNumber = (raw: string, type: CardType): boolean => {
  const cfg = getCardConfig(type);
  if (!cfg) return false;
  return cfg.regex.test(raw);
};
