/**
 * Formats a raw number string or numeric value into an Indonesian dot-separated format.
 * Example: "12000000" -> "12.000.000"
 */
export function formatNumberInput(value: string | number): string {
  if (value === undefined || value === null || value === '') return '';
  const str = value.toString().replace(/\D/g, '');
  if (!str) return '';
  const num = parseInt(str, 10);
  return num.toLocaleString('id-ID');
}

/**
 * Parses a dot-formatted string into a clean numeric value.
 * Example: "12.000.000" -> 12000000
 */
export function parseNumberInput(value: string): number {
  if (!value) return 0;
  const str = value.replace(/\D/g, '');
  return parseInt(str, 10) || 0;
}

/**
 * Smart compact currency abbreviation for constrained spaces.
 * Example: 25000000 -> "Rp 25M" (or 25 Jt), 1200000 -> "Rp 1,2M", 500000 -> "Rp 500k"
 */
export function formatCompactCurrency(value: number, currency = 'Rp'): string {
  if (!value && value !== 0) return `${currency} 0`;

  const absVal = Math.abs(value);
  const isNegative = value < 0;
  const prefix = isNegative ? '-' : '';

  if (absVal >= 1_000_000_000) {
    const formatted = (absVal / 1_000_000_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1,
    });
    return `${prefix}${currency} ${formatted}B`;
  }

  if (absVal >= 1_000_000) {
    const formatted = (absVal / 1_000_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1,
    });
    return `${prefix}${currency} ${formatted}M`;
  }

  if (absVal >= 1_000) {
    const formatted = (absVal / 1_000).toLocaleString('id-ID', {
      maximumFractionDigits: 1,
    });
    return `${prefix}${currency} ${formatted}k`;
  }

  return `${prefix}${currency} ${absVal.toLocaleString('id-ID')}`;
}
