import { getRewritesStarGistByUser, updateGistById } from "./gist";
import { createGist } from "./gist/post";
import { getStarredRepositories } from "./github/get-star-repos";
import { makeGitRepositoryTagsByGemini } from "./make-repository-tags";

export const startDateBuild = async ({
  githubUserId,
}: {
  githubUserId: string;
}) => {
  try {
    console.log("1. Get My Star Repositories");
    const repositories = await getStarredRepositories(githubUserId);

    console.log("2. Make Github Repository Tags JSON File");
    const repositoriesWithTags = await makeGitRepositoryTagsByGemini(
      repositories
    );

    const existGistId = await getRewritesStarGistByUser(githubUserId);

    if (existGistId) {
      console.log("3. Update JSON File to gist");
      await updateGistById(existGistId, repositoriesWithTags);
      return existGistId;
    }

    console.log("3. Upload JSON File to gist");
    const id = await createGist(repositoriesWithTags);
    return id;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
