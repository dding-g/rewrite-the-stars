import { octokit } from "@/shared/libs/oktokit";
import { getNextPageByGitResetLinkHeader } from "@/shared/utils/get-next-page";
import { GetStarRepositoriesError } from "./get-star-repositories-error";

type GetStarredRepositoriesItem = {
  nodeId: string;
  name: string;
  htmlUrl: string;
  private: boolean;
  description: string;
  topics: string[];
  updatedAt: string;
  stargazersCount: number;
};

const itemParser = (repo: any): GetStarredRepositoriesItem => {
  return {
    nodeId: repo.node_id,
    name: repo.name,
    htmlUrl: repo.html_url,
    private: repo.private,
    description: repo.description,
    updatedAt: repo.updated_at,
    topics: repo.topic,
    stargazersCount: repo.stargazersCount,
  };
};

/**
 * @description Fetches the starred repositories of a user.
 * @param username The username of the user.
 * @returns The starred repositories of the user.
 */
export const getStarredRepositories = async (username: string) => {
  try {
    // pagination page number
    let page = 1;
    // data to store the fetched repositories
    let data: GetStarredRepositoriesItem[] = [];

    while (true) {
      // get the starred repositories of the user
      const response = await octokit.rest.activity.listReposStarredByUser({
        username: username,
        page,
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch starred repositories for ${username}`);
      }

      // parse the response and extract the required data
      data = data.concat(response.data.map(itemParser));

      const nextPage = getNextPageByGitResetLinkHeader(
        response.headers.link ?? ""
      );

      // if there is no next page, break the loop
      if (!nextPage) {
        break;
      }

      page = nextPage ?? page + 1;
    }
    return data;
  } catch (error: any) {
    throw new GetStarRepositoriesError(error.message);
  }
};
