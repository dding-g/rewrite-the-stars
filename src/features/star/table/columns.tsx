"use client";

import { StarData } from "@/types/data";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export const columns: ColumnDef<StarData>[] = [
  {
    accessorKey: "tags",
    header: "태그",
    cell: (row) => {
      const tags = (row.getValue() as string[]) ?? [];
      return (
        <div className="flex flex-wrap gap-2">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "저장소 이름",
    size: 200,
    cell: (row) => {
      const name = row.getValue() as string;
      return (
        <div className="text-sm font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "설명",
    size: 400,
    cell: (row) => {
      const description = row.getValue() as string;
      return <div className="text-sm whitespace-normal">{description}</div>;
    },
  },
  {
    accessorKey: "htmlUrl",
    header: "링크",
    size: 50,
    cell: (row) => {
      const url = row.getValue() as string;
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
        >
          링크
        </a>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "최근 저장소 업데이트",
    cell: (row) => {
      const date = row.getValue() as string;
      const parsedDate = dayjs(new Date(date)).format("YYYY-MM-DD");
      return <time dateTime={parsedDate}>{parsedDate}</time>;
    },
  },
  // {
  //   accessorKey: "private",
  //   header: "공개/비공개",
  //   cell: (row) => {
  //     const isPrivate = row.getValue() as boolean;
  //     return (
  //       <span className="text-sm font-semibold">
  //         {isPrivate ? "비공개" : "공개"}
  //       </span>
  //     );
  //   },
  // },
];
