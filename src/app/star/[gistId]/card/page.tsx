import { StarCardList } from "@/features/star/card-list";
import { octokit } from "@/shared/libs/oktokit";

export default async function GistPage({
  params,
}: {
  params: Promise<{ gistId: string }>;
}) {
  const { gistId } = await params;
  const gist = await octokit.gists.get({ gist_id: gistId });

  const result = JSON.parse(
    gist.data.files?.["rewrites-the-stars.json"]?.content ?? "{}"
  );

  return (
    <div className="">
      <StarCardList data={result} />
    </div>
  );
}
