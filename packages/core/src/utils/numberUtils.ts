class NumberUtil {
  static formatNumber(number: number, locale: string = 'en-US', options: Intl.NumberFormatOptions = {}): string {
    return new Intl.NumberFormat(locale, {
      ...options,
    }).format(number);
  }

  static formatCurrency(number: number, locale: string = 'en-US', options: Intl.NumberFormatOptions = {}): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currency: 'USD',
      ...options,
      style: 'currency',
    }).format(number);
  }
}

export default NumberUtil;
