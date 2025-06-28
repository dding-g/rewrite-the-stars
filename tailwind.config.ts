import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Tailwind CSS 4.1에서는 대부분의 설정이 CSS @theme에서 처리됨
      // 필요한 경우에만 여기에 추가 설정을 작성
    },
  },
  plugins: [],
};

export default config;