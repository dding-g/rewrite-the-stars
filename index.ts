import { getStarredRepositories } from "./src/services/get-starred-repos";

const getStarredRepos = async (username: string) => {
  const response = await getStarredRepositories(username);
  console.log(response);
};

await getStarredRepos("dding-g");
