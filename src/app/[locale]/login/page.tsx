'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Meteors } from '@/shared/ui/magic-ui/meteors';
import { ShineBorder } from '@/shared/ui/magic-ui/shine-border';
import { AnimatedSubscribeButton } from '@/shared/ui/magic-ui/animated-subscribe-button';
import { GradientText } from '@/shared/ui/magic-ui/gradient-text';
import { motion } from 'framer-motion';

/**
 * 로그인 페이지 컴포넌트
 * GitHub SSO 로그인 인터페이스를 제공
 */
export default function LoginPage() {
	const t = useTranslations('auth');
	const [isLoading, setIsLoading] = useState(false);

	// GitHub OAuth 로그인 핸들러
	const handleGitHubLogin = () => {
		setIsLoading(true);
		// API 엔드포인트로 리다이렉트
		window.location.href = '/api/auth/github';
	};

	return (
		<div className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
			<Meteors number={30} />
			
			<motion.div 
				className="relative z-10 w-full max-w-md mx-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<ShineBorder
					className="w-full"
					color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
					borderRadius={16}
					duration={8}
				>
					<div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl border border-gray-200">
						<div className="text-center mb-8">
							<motion.h1 
								className="text-4xl font-bold mb-4"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								<GradientText 
									gradient="from-blue-600 via-purple-600 to-pink-600"
									className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
								>
									{t('welcome')}
								</GradientText>
							</motion.h1>
							<motion.p 
								className="text-gray-600 leading-relaxed"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.4 }}
							>
								{t('loginDescription')}
							</motion.p>
						</div>

						<motion.div 
							className="space-y-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
						>
							<div className="flex justify-center">
								<AnimatedSubscribeButton
									initialText={
										<span className="flex items-center gap-2 text-white">
											<svg
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 20 20"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
													clipRule="evenodd"
												/>
											</svg>
											{t('loginWithGitHub')}
										</span>
									}
									changeText={
										<span className="flex items-center gap-2">
											<div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
											Loading...
										</span>
									}
									onClick={handleGitHubLogin}
									disabled={isLoading}
									className="w-full bg-gray-900 text-white hover:bg-gray-800 border border-gray-300 transition-colors duration-200"
								/>
							</div>

							<motion.div 
								className="text-center"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.8 }}
							>
								<p className="text-xs text-gray-500 leading-relaxed">
									{t('termsText')}
								</p>
							</motion.div>
						</motion.div>

						{/* 장식용 요소들 */}
						<div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
						<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
					</div>
				</ShineBorder>
			</motion.div>
		</div>
	);
}
