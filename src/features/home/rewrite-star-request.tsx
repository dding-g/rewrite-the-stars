"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import RedirectButtons from "./redirect-buttons";

const RewriteStarRequestGroup = () => {
  const [githubName, setGithubName] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");

  const requestRewriteStar = async () => {
    try {
      const res = await fetch(`api/github/star-summary/${githubName}`, {
        method: "GET",
      });
      const id = await res.json();

      setId(id);

      toast.success(`Successfully rewrote the star.`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to rewrite star. Please try again later.");
    }
  };

  const getExistingGist = async (e: any) => {
    setLoading(true);
    try {
      e.preventDefault();
      const res = await fetch(`api/gist/github-id/${githubName}`, {
        method: "GET",
      });
      const { data } = await res.json();

      if (data) {
        setId(data);
      } else {
        requestRewriteStar();
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to get existing gist. Please try again later.");
    }
    setLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGithubName(e.target.value);
  };

  return (
    <div>
      <form onSubmit={getExistingGist}>
        <div className="space-y-2">
          <Input
            className="bg-white"
            placeholder="github name"
            value={githubName}
            onChange={onChange}
            disabled={loading}
            required
          />
          <Button className="w-full" loading={loading} type="submit">
            <span className="text-yellow-300">
              <Star />
            </span>
            rewrites the star
          </Button>
        </div>
      </form>

      {!!id && <RedirectButtons id={id} />}
    </div>
  );
};

export default RewriteStarRequestGroup;
