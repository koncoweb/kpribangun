
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
 * Format a number with thousand separators
 * @param value number to format
 * @returns formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('id-ID').format(value);
};

/**
 * Format a number input with thousand separators
 * @param value the input value to format
 * @returns formatted string for display
 */
export const formatNumberInput = (value: string | number): string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  // Convert to string and remove any non-numeric characters except decimal point
  const numericString = typeof value === 'string' 
    ? value.replace(/[^\d]/g, '') 
    : String(value).replace(/[^\d]/g, '');
  
  if (!numericString) return '';
  
  // Parse the numeric string to a number
  const numericValue = parseInt(numericString, 10);
  
  if (isNaN(numericValue)) return '';
  
  // Format with thousand separators
  return new Intl.NumberFormat('id-ID').format(numericValue);
};

/**
 * Clean formatted number input to get raw numeric value
 * @param formattedValue formatted string input with separators
 * @returns cleaned numeric value as number
 */
export const cleanNumberInput = (formattedValue: string): number => {
  // Remove all non-digit characters
  const cleanValue = formattedValue.replace(/[^\d]/g, '');
  
  // Parse to number, default to 0 if invalid
  return cleanValue ? parseInt(cleanValue, 10) : 0;
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
  
  return new Intl.DateTimeFormat('id-ID', options).format(date);
};
