// Utility functions for handling timezone-aware date formatting

export interface TimezoneOptions {
  timezone?: string;
  locale?: string;
  format?: 'relative' | 'absolute' | 'both';
}

/**
 * Format a timestamp according to user's timezone and locale
 */
export function formatTimestamp(
  timestamp: string | Date,
  options: TimezoneOptions = {}
): string {
  const {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale = navigator.language,
    format = 'relative'
  } = options;

  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (format === 'relative' || format === 'both') {
    const relativeTime = formatRelativeTime(diff, locale);
    
    if (format === 'both') {
      const absoluteTime = formatAbsoluteTime(date, timezone, locale);
      return `${relativeTime} (${absoluteTime})`;
    }
    
    return relativeTime;
  }

  return formatAbsoluteTime(date, timezone, locale);
}

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(diffMs: number, locale: string = navigator.language): string {
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Use Intl.RelativeTimeFormat for proper localization
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (seconds < 60) {
    return rtf.format(0, 'second'); // "now"
  } else if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (hours < 24) {
    return rtf.format(-hours, 'hour');
  } else if (days < 7) {
    return rtf.format(-days, 'day');
  } else if (weeks < 4) {
    return rtf.format(-weeks, 'week');
  } else if (months < 12) {
    return rtf.format(-months, 'month');
  } else {
    return rtf.format(-years, 'year');
  }
}

/**
 * Format absolute time with timezone (e.g., "Jan 15, 2025, 3:30 PM PST")
 */
export function formatAbsoluteTime(
  date: Date,
  timezone: string,
  locale: string = navigator.language
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
}

/**
 * Format date only (e.g., "January 15, 2025")
 */
export function formatDateOnly(
  date: Date | string,
  timezone?: string,
  locale: string = navigator.language
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj);
}

/**
 * Format time only (e.g., "3:30 PM")
 */
export function formatTimeOnly(
  date: Date | string,
  timezone?: string,
  locale: string = navigator.language
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour: 'numeric',
    minute: '2-digit'
  }).format(dateObj);
}

/**
 * Get user's detected timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get timezone offset string (e.g., "UTC+8", "UTC-5")
 */
export function getTimezoneOffset(timezone?: string): string {
  const tz = timezone || getUserTimezone();
  const date = new Date();
  
  // Get the offset in minutes
  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.abs(offsetMinutes) / 60;
  const sign = offsetMinutes <= 0 ? '+' : '-';
  
  // Format as UTC±X
  if (offsetHours === Math.floor(offsetHours)) {
    return `UTC${sign}${Math.floor(offsetHours)}`;
  } else {
    const hours = Math.floor(offsetHours);
    const minutes = Math.abs(offsetMinutes) % 60;
    return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }
}

/**
 * Check if a date is today in the user's timezone
 */
export function isToday(date: Date | string, timezone?: string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const tz = timezone || getUserTimezone();
  
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
  
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(now);
  
  return dateStr === todayStr;
}

/**
 * Check if a date is yesterday in the user's timezone
 */
export function isYesterday(date: Date | string, timezone?: string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const tz = timezone || getUserTimezone();
  
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
  
  const yesterdayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(yesterday);
  
  return dateStr === yesterdayStr;
}

/**
 * Smart timestamp formatting that shows appropriate detail based on age
 */
export function formatSmartTimestamp(
  timestamp: string | Date,
  timezone?: string,
  locale?: string
): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const tz = timezone || getUserTimezone();
  const loc = locale || navigator.language;
  
  if (isToday(date, tz)) {
    return `Today at ${formatTimeOnly(date, tz, loc)}`;
  } else if (isYesterday(date, tz)) {
    return `Yesterday at ${formatTimeOnly(date, tz, loc)}`;
  } else {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) {
      // Show day of week for recent dates
      const dayName = new Intl.DateTimeFormat(loc, {
        timeZone: tz,
        weekday: 'long'
      }).format(date);
      return `${dayName} at ${formatTimeOnly(date, tz, loc)}`;
    } else {
      // Show full date for older dates
      return formatAbsoluteTime(date, tz, loc);
    }
  }
}

/**
 * Convert UTC timestamp to local timezone
 * This is the key function to fix the 8-hour offset issue
 */
export function convertUTCToLocal(utcTimestamp: string): Date {
  // The database stores timestamps as UTC strings like "2025-01-27 10:30:00"
  // But JavaScript Date constructor treats them as local time
  // We need to explicitly parse them as UTC
  
  // If the timestamp already has timezone info, use it directly
  if (utcTimestamp.includes('T') || utcTimestamp.includes('Z') || utcTimestamp.includes('+')) {
    return new Date(utcTimestamp);
  }
  
  // If it's a simple format like "2025-01-27 10:30:00", treat it as UTC
  const utcDate = new Date(utcTimestamp + ' UTC');
  return utcDate;
}

/**
 * Enhanced formatTimestamp that handles UTC conversion
 */
export function formatTimestampWithUTC(
  timestamp: string | Date,
  options: TimezoneOptions = {}
): string {
  let date: Date;
  
  if (typeof timestamp === 'string') {
    date = convertUTCToLocal(timestamp);
  } else {
    date = timestamp;
  }
  
  return formatTimestamp(date, options);
}

/**
 * Enhanced formatSmartTimestamp that handles UTC conversion
 */
export function formatSmartTimestampWithUTC(
  timestamp: string | Date,
  timezone?: string,
  locale?: string
): string {
  let date: Date;
  
  if (typeof timestamp === 'string') {
    date = convertUTCToLocal(timestamp);
  } else {
    date = timestamp;
  }
  
  return formatSmartTimestamp(date, timezone, locale);
}