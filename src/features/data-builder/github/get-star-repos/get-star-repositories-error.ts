export class GetStarRepositoriesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetStarredRepositoriesError";
  }
}
