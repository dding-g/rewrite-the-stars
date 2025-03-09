export class GetStarredRepositoriesError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GetStarredRepositoriesError";
  }
}
