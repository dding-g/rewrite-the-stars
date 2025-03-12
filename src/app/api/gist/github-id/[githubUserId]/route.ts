import { startDateBuild } from "@/features/data-builder";
import { getRewritesStarGistByUser } from "@/features/data-builder/gist";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ githubUserId: string }> }
) => {
  try {
    const { githubUserId } = await params;

    if (!!githubUserId) {
      const existGistId = await getRewritesStarGistByUser(githubUserId);

      return NextResponse.json(
        { data: existGistId },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      { message: "Not Valid Github User Id" },
      { status: 400 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
};
