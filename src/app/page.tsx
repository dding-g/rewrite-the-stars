import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RewriteStarRequestGroup from "@/features/home/rewrite-star-request";
import { Star } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <RewriteStarRequestGroup />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a href="https://www.buymeacoffee.com/ddingg" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style={{
              width: 217,
              height: 60,
            }}
          />
        </a>
      </footer>
    </div>
  );
}
