import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { YYYYMMDD } from "@/shared/utils/date";
import { starCountFormat } from "@/shared/utils/format";
import { StarData } from "@/types/data";
import { Star } from "lucide-react";
import React from "react";

type Props = {} & StarData;
export default function StarCard(props: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span>{props.name}</span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-300">
              <Star width={16} />
            </span>
            <span className="text-sm text-gray-600">
              {starCountFormat(props.stargazersCount ?? 0)}
            </span>
          </div>
        </CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2 flex-1">
        {props.tags.map((tag) => (
          <Badge key={tag} color="blue">
            {tag}
          </Badge>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between">
        <a
          href={props.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="bg-black text-white p-2 rounded-full hover:scale-110 transition-transform"
        >
          <GithubSvg />
        </a>
        <div className="text-sm text-gray-500">
          {`${YYYYMMDD(props.pushedAt)}`}
        </div>
      </CardFooter>
    </Card>
  );
}

const GithubSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
