import { octokit } from "@/shared/libs/oktokit";
import { GetGistError } from "./get-gist-error";

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
