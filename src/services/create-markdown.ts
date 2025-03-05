import { gemini } from "../libs/gemini";
import type { createGitRepositoryTagsByGemini } from "./create-repository-tags";

const prompt = (response: Array<any>) => `
주어진 GitHub 저장소 데이터와 태그 데이터를 기반으로 각 저장소를 소개하는 Markdown 형식의 설명을 생성해주세요.

## 조건

* 각 저장소의 이름, 설명, 태그를 포함해야 합니다.
* Markdown 형식으로 작성해야 합니다.
* 태그는 "#태그명" 형식으로 표시해주세요.
* 저장소의 주요 특징이나 사용 사례를 간략하게 설명해주세요.
* 설명은 독자가 저장소를 이해하고 활용하는 데 도움이 되도록 작성해주세요.

## 제공된 데이터

${JSON.stringify(response)}
  `;

export const createMarkdownByGemini = async (
  data: Awaited<ReturnType<typeof createGitRepositoryTagsByGemini>>
) => {
  try {
    return await gemini(prompt(data ?? []));
  } catch (err) {
    console.error(err);
    throw err;
  }
};
