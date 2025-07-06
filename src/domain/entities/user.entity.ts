export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  // Métodos de dominio
  updateName(newName: string): User {
    if (!newName || newName.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    return new User(
      this.id,
      this.email,
      newName.trim(),
      this.createdAt,
      new Date(),
    );
  }

  isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }
}
