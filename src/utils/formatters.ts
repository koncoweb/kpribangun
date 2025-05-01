
/**
 * Format a date string to a localized format
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};

/**
 * Format a number as IDR currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format a phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Basic formatting for Indonesian phone numbers
  if (!phoneNumber) return "";
  
  // Remove any non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");
  
  // Format based on length
  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}`;
  }
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString("id-ID");
};
