export class GetRewritesStarGistByUserError extends Error {
  constructor(err: any) {
    super(`Failed to get gists by user: ${err.message}`);
  }
}
