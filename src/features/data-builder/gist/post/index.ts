import { GIST_FILE_NAME } from "@/constants/file";
import { CreateGistError } from "./create-gist-error";
import { octokit } from "@/shared/libs/oktokit";

export const createGist = async (content: any) => {
  try {
    const { data } = await octokit.request("POST /gists", {
      files: {
        [GIST_FILE_NAME]: {
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
