'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { GradientText } from '@/shared/ui/magic-ui/gradient-text';
import { ShimmerButton } from '@/shared/ui/magic-ui/shimmer-button';
import { Particles } from '@/shared/ui/magic-ui/particles';
import { MagicCard } from '@/shared/ui/magic-ui/magic-card';
import { Marquee } from '@/shared/ui/magic-ui/marquee';
import { motion } from 'framer-motion';
import { RainbowButton } from '@/shared/ui/magic-ui/rainbow-button';
import { Star, Github } from 'lucide-react';

/**
 * 홈페이지 컴포넌트
 * 프로젝트 소개 및 로그인 CTA를 제공
 */
export default function HomePage() {
	const t = useTranslations('home');
	const authT = useTranslations('auth');

	const handleGitHubLogin = () => {
			window.location.href = '/api/auth/github';
		};


	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-center flex flex-col gap-4 items-center">
          <Link href="/" className="relative inline-block cursor-pointer">
            <Github size={64} className="text-gray-700 dark:text-gray-300" />
            <Star size={24} className="absolute -top-1 -right-1 text-yellow-400 fill-yellow-400" />
          </Link>
          <h1 className="text-lg">
            Sign in with GitHub to manage your starred repositories
          </h1>
          <div className="space-y-2">
      <RainbowButton className="w-full" type="button" onClick={handleGitHubLogin}>
        <span className="text-yellow-300">
          <Star />
        </span>
        rewrites the star
      </RainbowButton>
    </div>
        </div>
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
