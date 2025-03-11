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

export const getRewritesStarGistByUser = async (username: string) => {
  try {
    let page = 1;
    let gistId = undefined;

    while (true) {
      // get the starred repositories of the user
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

      const id = findRewritesStarGist(response.data);

      if (id) {
        gistId = id;
        break;
      }

      const nextPage = getNextPageByGitResetLinkHeader(
        response.headers.link ?? ""
      );

      // if there is no next page, break the loop
      if (!nextPage) {
        break;
      }

      page = nextPage ?? page + 1;
    }

    return gistId;
  } catch (err: any) {
    console.error(err);
    throw new GetRewritesStarGistByUserError(err.message);
  }
};
