"use client";

import React, { useState } from "react";
import StarCard from "./star-card";
import { StarData } from "@/types/data";
import TagFilter from "@/components/tag-filter";
import { IconCloud } from "@/components/magicui/icon-cloud";

type Props = {
  data: StarData[];
};
export function StarCardList({ data }: Props) {
  const duplicateRemoveTags = Array.from(
    new Set(data.map((v) => v.tags).flat())
  );
  const [tags, setTags] = useState(duplicateRemoveTags);

  const filterData = data.filter((v) =>
    v.tags.some((tag) => tags.includes(tag))
  );

  return (
    <div className="space-y-10">
      <TagFilter
        id={"tag-filter"}
        tags={duplicateRemoveTags}
        onChange={setTags}
      />
      <div className="flex justify-center">
        <IconCloud images={filterData.map((v) => v.avatarUrl)} />
      </div>
      <div className="space-y-4">
        <div className="text-lg text-gray-900">{`총 ${filterData.length}개의 저장소가 검색되었습니다.`}</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filterData.map((v) => (
            <StarCard key={v.nodeId} {...v} />
          ))}
        </div>
      </div>
    </div>
  );
}
