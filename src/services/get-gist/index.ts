import { octokit } from "../../libs/oktokit";
import { GetGistError } from "./error";

export const getGistById = async (id: string) => {
  try {
    const { data } = await octokit.request("GET /gists/{gist_id}", {
      gist_id: id,
    });

    return data;
  } catch (err: any) {
    throw new GetGistError(err.message);
  }
};
