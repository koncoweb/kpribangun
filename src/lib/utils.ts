
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate unique ID with prefix
export function generateId(prefix: string = ""): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
}

// Format currency to Rupiah
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date to Indonesian format
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// Format short date (DD/MM/YYYY)
export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

// Format time (HH:MM)
export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)}, ${formatTime(date)}`;
}
