import { format, parseISO, isToday, isTomorrow, isPast, isValid } from 'date-fns';

// Human-friendly label for a todo's due date. Returns '' when there is none.
export function formatDueDate(isoDateString) {
  if (!isoDateString) return '';

  const date = parseISO(isoDateString);
  if (!isValid(date)) return '';

  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';

  return format(date, 'MMM d, yyyy');
}

export function isOverdue(isoDateString, completed = false) {
  if (!isoDateString || completed) return false;

  const date = parseISO(isoDateString);
  if (!isValid(date)) return false;

  return isPast(date) && !isToday(date);
}

// For populating a <input type="date"> field, which expects 'yyyy-MM-dd'.
export function toDateInputValue(isoDateString) {
  if (!isoDateString) return '';
  const date = parseISO(isoDateString);
  if (!isValid(date)) return '';
  return format(date, 'yyyy-MM-dd');
}
