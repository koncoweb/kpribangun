

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

/**
 * Check if a date is past due
 */
export const isPastDue = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to get just the date
  
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0); // Reset time part for fair comparison
  
  return dueDate < today;
};

/**
 * Calculate the number of days a date is overdue
 */
export const getDaysOverdue = (dateString: string): number => {
  if (!isPastDue(dateString)) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part
  
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0); // Reset time part
  
  // Calculate difference in milliseconds and convert to days
  const diffTime = today.getTime() - dueDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

