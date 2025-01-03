import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Set default timezone
dayjs.tz.setDefault('UTC');

// Format with localized format (similar to moment's 'lll')
export const formatDateTime = (date) => {
  if (!date) return null;
  return dayjs(date).format('MMM D, YYYY h:mm A');
};

// Format date only
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return null;
  return dayjs(date).format(format);
};

// Format time only
export const formatTime = (date) => {
  if (!date) return null;
  return dayjs(date).format('HH:mm:ss');
};

// Get relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return null;
  return dayjs(date).fromNow();
};

// Compare two dates (for sorting)
export const compareDates = (date1, date2) => {
  return dayjs(date1).valueOf() - dayjs(date2).valueOf();
};

// Check if date is valid
export const isValidDate = (date) => {
  return dayjs(date).isValid();
};

// Parse date with format
export const parseDate = (dateString, format) => {
  return dayjs(dateString, format);
};

export default dayjs; 