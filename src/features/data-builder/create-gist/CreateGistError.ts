export class CreateGistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateGistError";
  }
}
