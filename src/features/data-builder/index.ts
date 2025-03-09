import { createGist } from "./create-gist";
import { getGistById } from "./get-gist";
import { getStarredRepositories } from "./get-starred-repos";
import { makeGitRepositoryTagsByGemini } from "./make-repository-tags";

export const startDateBuild = async () => {
  try {
    console.log("====== Get My Star Repositories ======");
    const repositories = await getStarredRepositories("dding-g");

    console.log("====== Make Github Repository Tags JSON File ======");
    const repositoriesWithTags = await makeGitRepositoryTagsByGemini(
      repositories
    );

    console.log("====== Upload JSON File to gist ======");
    const id = await createGist(repositoriesWithTags);

    console.log("====== Check Upload ======");
    const gists = await getGistById(id);
    JSON.parse(gists.files?.["rewrites-the-stars.json"]?.content ?? "[]");
  } catch (err) {
    console.error(err);
    throw err;
  }
};
