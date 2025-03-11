import React from "react";
import { DataTable } from "./table/data-table";
import { columns, GistStarData } from "./table/columns";

type Props = {
  data: GistStarData[];
};
export default function GistTable({ data }: Props) {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
