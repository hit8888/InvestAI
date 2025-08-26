class NumberUtil {
  static formatNumber(number: number, locale: string = 'en-US', options: Intl.NumberFormatOptions = {}): string {
    if (!this.isNumber(number)) {
      return number.toString();
    }

    return new Intl.NumberFormat(locale, {
      ...options,
    }).format(number);
  }

  static formatCurrency(number: number, locale: string = 'en-US', options: Intl.NumberFormatOptions = {}): string {
    if (!this.isNumber(number)) {
      return number.toString();
    }

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: 'USD',
      ...options,
      style: 'currency',
    }).format(number);
  }

  static isNumber(value: unknown): boolean {
    return !isNaN(Number(value)) && typeof value === 'number';
  }
}
export default NumberUtil;
