export class InvalidEmailError extends Error {
  constructor(public email: string) {
    super(`Invalid email: ${email}`);
    this.name = "InvalidEmailError";
  }
}
