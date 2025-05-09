
/**
 * Format a number as Indonesian Rupiah (IDR)
 * @param amount number to format
 * @param includeSymbol whether to include the Rp symbol
 * @returns formatted currency string
 */
export const formatCurrency = (amount: number, includeSymbol = true): string => {
  return new Intl.NumberFormat('id-ID', {
    style: includeSymbol ? 'currency' : 'decimal',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a date string to Indonesian format
 * @param dateString ISO date string
 * @param format format type ('short', 'medium', 'long', 'full')
 * @returns formatted date string
 */
export const formatDate = (dateString: string, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string => {
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'short' : 'long',
    day: 'numeric',
  };
  
  if (format === 'full') {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  } else if (format === 'long') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormatter('id-ID', options).format(date);
};
