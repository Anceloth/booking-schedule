export class CalendarConflictException extends Error {
  constructor(
    participantEmail: string,
    conflictingEvents: Array<{ title: string; start: Date; end: Date }>,
  ) {
    const conflictDetails = conflictingEvents
      .map(
        (event) =>
          `"${event.title}" (${event.start.toISOString()} - ${event.end.toISOString()})`,
      )
      .join(', ');

    super(
      `Calendar conflict detected for participant ${participantEmail}. ` +
        `Conflicting events: ${conflictDetails}`,
    );

    this.name = 'CalendarConflictException';
  }
}
