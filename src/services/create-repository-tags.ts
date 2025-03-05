import { gemini } from "../libs/gemini";
import { getStarredRepositories } from "./get-starred-repos";

const prompt = (response: Array<any>) => `
## Description
1. From the list of GitHub repositories defined within the data, please extract the tag keywords for each repository and return them in JSON format.
2. Tag keywords are words that are useful for filtering the repositories.
3. Tag can be korean. this service is for korean users.

## Use this JSON schema. Please return stringify json to use JSON.parse() function.
[
  {
    "node_id": string,
    "tags": ["tag1", "tag2", "tag3", ...]
  },
   {
    "node_id": string,
    "tags": []
  },
  ...
]

## Data
${JSON.stringify(response)}
  `;

export const createGitRepositoryTagsByGemini = async (
  data: Awaited<ReturnType<typeof getStarredRepositories>>
) => {
  try {
    const response = await gemini(prompt(data ?? []), {
      responseMimeType: "application/json",
    });
    const obj = JSON.parse(response);
    return data?.map((item) => ({
      ...item,
      tags: obj.find((tag: any) => tag.node_id === item.nodeId)?.tags || [],
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
