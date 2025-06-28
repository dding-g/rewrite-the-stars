import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스들을 조건부로 결합하고 충돌을 해결하는 유틸리티 함수
 * @param inputs - 결합할 클래스 값들
 * @returns 정리된 클래스 문자열
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}