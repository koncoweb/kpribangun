
import { formatRupiah, formatDate as formatDateUtil, formatDateTime } from "@/lib/utils";

/**
 * Format a currency value to Indonesian Rupiah format
 */
export const formatCurrency = formatRupiah;

/**
 * Format a date to Indonesian locale format (DD MMMM YYYY)
 */
export const formatDate = formatDateUtil;

/**
 * Format date and time to Indonesian locale format (DD MMMM YYYY, HH:MM)
 */
export const formatFullDateTime = formatDateTime;
