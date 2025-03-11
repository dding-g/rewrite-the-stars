import { startDateBuild } from "@/features/data-builder";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ githubUserId: string }> }
) => {
  try {
    const { githubUserId } = await params;

    if (!!githubUserId) {
      const data = await startDateBuild({
        githubUserId,
      });

      return NextResponse.json(
        { data },
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
