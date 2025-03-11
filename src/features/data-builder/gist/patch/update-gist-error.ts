export class UpdateGistError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "UpdateGistError";
  }
}
