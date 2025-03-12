import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { StarData } from "@/types/data";

type Props = {
  data: StarData[];
};
export default function StarTable({ data }: Props) {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
