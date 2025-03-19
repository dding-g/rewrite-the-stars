"use client";

import React, { useState } from "react";
import { Badge } from "./ui/badge";

type Props = {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
};

/**
 * @description Tag 필터링 컴포넌트
 */
export default function TagFilter({ id, tags, onChange }: Props) {
  const [selectedTags, setSelectedTags] = useState(tags);

  const handleTagChange = (value: string) => {
    if (selectedTags.includes(value)) {
      const newTags = selectedTags.filter((tag) => tag !== value);
      onChange(newTags);
      setSelectedTags(newTags);
    } else {
      onChange([...selectedTags, value]);
      setSelectedTags([...selectedTags, value]);
    }
  };

  return (
    <div role="group" aria-labelledby={id} className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag}
          className="cursor-pointer text-sm"
          variant={selectedTags.includes(tag) ? "secondary" : "outline"}
          onClick={() => handleTagChange(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
