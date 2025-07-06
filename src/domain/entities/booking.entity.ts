export class Booking {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly organizerId: string,
    public readonly participants: string[] = [],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  // Métodos de dominio
  addParticipant(participantId: string): Booking {
    if (this.participants.includes(participantId)) {
      throw new Error('Participant already exists in the booking');
    }

    return new Booking(
      this.id,
      this.title,
      this.description,
      this.startDate,
      this.endDate,
      this.organizerId,
      [...this.participants, participantId],
      this.createdAt,
      new Date(),
    );
  }

  removeParticipant(participantId: string): Booking {
    const updatedParticipants = this.participants.filter(
      (id) => id !== participantId,
    );

    return new Booking(
      this.id,
      this.title,
      this.description,
      this.startDate,
      this.endDate,
      this.organizerId,
      updatedParticipants,
      this.createdAt,
      new Date(),
    );
  }

  isActive(): boolean {
    const now = new Date();
    return this.startDate <= now && now <= this.endDate;
  }

  hasParticipant(participantId: string): boolean {
    return this.participants.includes(participantId);
  }

  getDuration(): number {
    return this.endDate.getTime() - this.startDate.getTime();
  }
}
