import { octokit } from "@/shared/libs/oktokit";
import { getNextPageByGitResetLinkHeader } from "@/shared/utils/get-next-page";
import { GetStarRepositoriesError } from "./get-star-repositories-error";
import { StarData } from "@/types/data";

const itemParser = (repo: any): StarData => {
  const avatarUrl =
    repo.organization?.avatar_url ?? repo.owner?.avatar_url ?? "";

  return {
    nodeId: repo.node_id,
    name: repo.name,
    htmlUrl: repo.html_url,
    private: repo.private,
    description: repo.description,
    updatedAt: repo.updated_at,
    topics: repo.topic,
    stargazersCount: repo.stargazers_count,
    pushedAt: repo.pushed_at,
    avatarUrl,
    tags: [],
  };
};

async function* fetchStarredReposPages(username: string) {
  let page = 1;

  while (true) {
    const response = await octokit.rest.activity.listReposStarredByUser({
      username,
      page,
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch starred repositories for ${username}`);
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

/**
 * @description Fetches the starred repositories of a user.
 * @param username The username of the user.
 * @returns The starred repositories of the user.
 */
export const getStarredRepositories = async (username: string) => {
  try {
    const data: StarData[] = [];

    for await (const reposPage of fetchStarredReposPages(username)) {
      const parsedItems = reposPage.map(itemParser);
      data.push(...parsedItems);
    }

    return data;
  } catch (error: any) {
    throw new GetStarRepositoriesError(error.message);
  }
};
