"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

type Props = {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
};
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
    <div className="space-y-4">
      <Input id={id} />
      <div>
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
      </div>
    </div>
  );
}
