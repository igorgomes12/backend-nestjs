export class InvalidNameError extends Error {
  constructor(public name: string) {
    super(`Invalid name: ${name}`);
    this.name = "InvalidNameError";
  }
}
