import { gemini } from "@/shared/libs/gemini";
import type { getStarredRepositories } from "../github/get-star-repos";
import { MakeRepositoryTagsError } from "./make-repositorty-tag-error";

const prompt = (response: Array<any>) => `
## Description
1. From the list of GitHub repositories defined within the data, please extract the tag keywords for each repository and return them in JSON format.
2. Tag keywords are words that are useful for filtering the repositories.
3. Tag can be korean. this service is for korean users.
4. response is must be only json.
5. response needs node_id and tags.

## Data
${JSON.stringify(response)}
  `;

export const makeGitRepositoryTagsByGemini = async (
  data: Awaited<ReturnType<typeof getStarredRepositories>>
) => {
  try {
    const response = await gemini(
      prompt(
        data?.map((v) => ({
          ...v,
          tags: [],
        })) ?? []
      ),
      {
        responseMimeType: "application/json",
      }
    );
    const obj = JSON.parse(response);

    return data?.map((item) => ({
      ...item,
      tags: obj.find((tag: any) => tag.node_id === item.nodeId)?.tags || [],
    }));
  } catch (err: any) {
    throw new MakeRepositoryTagsError(err.message);
  }
};
