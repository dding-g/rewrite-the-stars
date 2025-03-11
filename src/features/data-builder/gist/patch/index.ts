import { octokit } from "@/shared/libs/oktokit";
import { UpdateGistError } from "./update-gist-error";
import { GIST_FILE_NAME } from "@/constants/file";

export const updateGistById = async (id: string, content: any) => {
  try {
    const { data } = await octokit.request("PATCH /gists/{gist_id}", {
      gist_id: id,
      files: {
        [GIST_FILE_NAME]: {
          content: JSON.stringify(content, null, 2),
        },
      },
    });

    return data;
  } catch (err) {
    throw new UpdateGistError(err);
  }
};
