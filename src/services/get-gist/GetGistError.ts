export class GetGistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetGistError";
  }
}
