const getStarredRepos = async (username: string) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/starred`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }
  );
  const data = await response.json();
  console.log(data);
  return data;
};

await getStarredRepos("dding-g");
