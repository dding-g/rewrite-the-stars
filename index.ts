import { createGitRepositoryTagsByGemini } from "./src/services/create-repository-tags";
import { getStarredRepositories } from "./src/services/get-starred-repos";
import fs from "fs";

const repositories = await getStarredRepositories("dding-g");
const repositoriesWithTags = await createGitRepositoryTagsByGemini(
  repositories
);

fs.writeFileSync(
  "./result.html",
  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Starred Repositories</title>
    </head>
    <body>
    ${repositoriesWithTags
      ?.map((v) => {
        return `<div>
      <h2>${v.name}</h2>
      <p>${v.description}</p>
      <p>${v.tags.map((tag: string) => `#${tag}`).join(" ")}</p>
      <p>Updated at: ${v.updatedAt}</p>
      <p>Stargazers count: ${v.stargazersCount}</p>
      <a href="${v.htmlUrl}">Go to repository</a>
      </div>`;
      })
      .join("")}
    </body>
    </html>
    `
);
