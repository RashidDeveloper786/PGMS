export const ROOM_NUMBERS = Array.from({ length: 40 }, (_, i) => i + 101);

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue'
};

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MAX_ROOMMATES_PER_ROOM = 2;