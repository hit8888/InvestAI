class NumberUtil {
  static formatNumber(
    number?: number | string,
    locale: string = 'en-US',
    options: Intl.NumberFormatOptions = {},
  ): string {
    if (!this.isNumber(number)) {
      return number?.toString() ?? '';
    }

    return new Intl.NumberFormat(locale, {
      ...options,
    }).format(Number(number));
  }

  static formatCurrency(
    number?: number | string,
    locale: string = 'en-US',
    options: Intl.NumberFormatOptions = {},
  ): string {
    if (!this.isNumber(number)) {
      return number?.toString() ?? '';
    }

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: 'USD',
      ...options,
      style: 'currency',
    }).format(Number(number));
  }

  static isNumber(value: unknown): boolean {
    return !isNaN(Number(value));
  }
}
export default NumberUtil;
