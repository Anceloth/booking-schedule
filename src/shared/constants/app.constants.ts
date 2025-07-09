export const REPOSITORY_TOKENS = {
  BOOKING_REPOSITORY: 'BookingRepository',
  USER_REPOSITORY: 'UserRepository',
} as const;

export const SERVICE_TOKENS = {
  CALENDAR_SERVICE: 'CalendarService',
} as const;

export const DATABASE_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_BOOKING_DURATION_MINUTES: 15,
  MAX_BOOKING_DURATION_HOURS: 8,
  MAX_PARTICIPANTS: 100,
} as const;

export const ERROR_MESSAGES = {
  BOOKING_NOT_FOUND: 'Booking not found',
  USER_NOT_FOUND: 'User not found',
  INVALID_DATE_RANGE: 'Invalid date range',
  BOOKING_CONFLICT: 'Booking time conflict',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_ERROR: 'Validation error',
} as const;
