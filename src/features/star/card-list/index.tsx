import React from "react";
import StarCard from "./star-card";
import { StarData } from "@/types/data";

type Props = {
  data: StarData[];
};
export function StarCardList({ data }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((v) => (
        <StarCard key={v.nodeId} {...v} />
      ))}
    </div>
  );
}
