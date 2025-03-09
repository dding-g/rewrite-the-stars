import { createGist } from "./services/create-gist";
import { getGistById } from "./services/get-gist";
import { getStarredRepositories } from "./services/get-starred-repos";
import { makeGitRepositoryTagsByGemini } from "./services/make-repository-tags";

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
