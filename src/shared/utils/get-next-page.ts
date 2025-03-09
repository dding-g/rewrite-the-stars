/**
 *
 * @description Extracts the next page number from the Link header.
 * https://docs.github.com/ko/rest/using-the-rest-api/using-pagination-in-the-rest-api?apiVersion=2022-11-28#scripting-with-pagination
 */
export const getNextPageByGitResetLinkHeader = (linkHeader: string) => {
  // pagination continue check
  if (linkHeader.includes(`rel=\"next\"`)) {
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    const nextUrl = linkHeader.match(nextPattern);
    if (nextUrl) {
      const url = new URL(nextUrl[0]);
      return parseInt(url.searchParams.get("page") || "1");
    }
  }
  return null;
};
