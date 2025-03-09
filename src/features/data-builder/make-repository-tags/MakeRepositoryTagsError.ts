export class MakeRepositoryTagsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MakeRepositoryTagsError";
  }
}
