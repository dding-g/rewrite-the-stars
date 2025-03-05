import { gemini } from "./src/libs/gemini";
import { createGitRepositoryTagsByGemini } from "./src/services/create-repository-tags";
import { getStarredRepositories } from "./src/services/get-starred-repos";
import fs from "fs";

const getStarredRepos = async (username: string) => {
  const response = await getStarredRepositories(username);
  console.log(response);

  return createGitRepositoryTagsByGemini(response);
};

const res = await getStarredRepos("dding-g");

fs.writeFileSync("./starred-repos.json", JSON.stringify(res, null, 2));
