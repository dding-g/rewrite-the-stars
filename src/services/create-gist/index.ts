import { octokit } from "../../libs/oktokit";
import { CreateGistError } from "./error";

export const createGist = async (content: any) => {
  try {
    const { data } = await octokit.request("POST /gists", {
      files: {
        "rewrites-the-stars.json": {
          content: JSON.stringify(content, null, 2),
        },
      },
      public: true,
    });

    return data.id as string;
  } catch (err: any) {
    throw new CreateGistError(err.message);
  }
};
