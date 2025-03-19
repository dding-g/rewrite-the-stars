import { octokit } from "@/shared/libs/oktokit";
import { GetRewritesStarGistByUserError } from "./get-gists-by-user-error";
import { getNextPageByGitResetLinkHeader } from "@/shared/utils/get-next-page";
import { GIST_FILE_NAME } from "@/constants/file";

const findRewritesStarGist = (gist: any) => {
  const result = gist.find((g: any) => !!g.files?.[GIST_FILE_NAME]);
  if (!!result) {
    return result.id;
  }
  return null;
};

async function* fetchUserGistsPages(username: string) {
  let page = 1;

  while (true) {
    const response = await octokit.request("GET /users/{username}/gists", {
      username,
      page,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch gist for ${username} user, ${page} page`
      );
    }

    yield response.data;

    const linkHeader = response.headers.link ?? "";
    const nextPage = getNextPageByGitResetLinkHeader(linkHeader);

    if (!nextPage) {
      break;
    }

    page = nextPage;
  }
}

export const getRewritesStarGistByUser = async (username: string) => {
  try {
    for await (const gistData of fetchUserGistsPages(username)) {
      const id = findRewritesStarGist(gistData);

      if (id) {
        return id;
      }
    }

    return undefined;
  } catch (err: any) {
    console.error(err);
    throw new GetRewritesStarGistByUserError(err.message);
  }
};
