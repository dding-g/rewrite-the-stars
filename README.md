# Rewrite Stars ⭐

GitHub 즐겨찾기 저장소를 아름답고 정리된 대시보드로 변환하는 웹 애플리케이션입니다.

## 주요 기능

- 🔐 **GitHub SSO 인증**: 안전한 GitHub 계정 로그인
- 📊 **대시보드**: 즐겨찾기 저장소를 시각적으로 정리
- 🏷️ **태그 관리**: 커스텀 태그로 저장소 분류
- 🔍 **검색 & 필터**: 태그와 키워드로 빠른 검색
- 🔗 **공개 대시보드**: 정리된 컬렉션을 다른 사람과 공유
- 🌍 **다국어 지원**: 한국어와 영어 지원
- 🌙 **다크 모드**: 시스템 테마 자동 감지

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **백엔드**: Next.js API Routes, Supabase
- **데이터베이스**: PostgreSQL (Supabase)
- **인증**: GitHub OAuth
- **국제화**: next-intl 4.0
- **패키지 매니저**: Bun
- **린팅**: Biome
- **배포**: Vercel

## 시작하기

### 사전 요구사항

- Node.js 18+
- Bun 1.0+
- GitHub OAuth 앱 설정
- Supabase 프로젝트

### 설치

1. 저장소 클론:
```bash
git clone https://github.com/your-username/rewrite-stars.git
cd rewrite-stars
```

2. 의존성 설치:
```bash
bun install
```

3. 환경변수 설정:
```bash
cp .env.example .env
```

4. `.env` 파일에 필요한 값들을 설정하세요.

5. 개발 서버 실행:
```bash
bun dev
```

### 환경변수

다음 환경변수들을 설정해야 합니다:

- `GITHUB_CLIENT_ID`: GitHub OAuth 앱 클라이언트 ID
- `GITHUB_CLIENT_SECRET`: GitHub OAuth 앱 클라이언트 시크릿
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 롤 키
- `NEXTAUTH_SECRET`: NextAuth 시크릿 키
- `ENCRYPTION_KEY`: 데이터 암호화용 32바이트 키

## 개발 명령어

```bash
# 개발 서버 실행
bun dev

# 프로덕션 빌드
bun build

# 프로덕션 서버 실행
bun start

# 린팅
bun lint

# 린팅 자동 수정
bun lint:fix

# 타입 체크
bun type-check

# 테스트 실행
bun test
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 국제화 라우팅
│   └── api/               # API 라우트
├── entities/              # 데이터베이스 엔티티 타입
├── features/              # 기능별 컴포넌트
├── shared/                # 공유 유틸리티 및 컴포넌트
│   ├── libs/             # 라이브러리 래퍼
│   ├── utils/            # 유틸리티 함수
│   └── ui/               # UI 컴포넌트
└── middleware.ts          # Next.js 미들웨어
```

## 데이터베이스 스키마

### 주요 테이블

- **users**: GitHub 사용자 정보
- **repositories**: 저장소 메타데이터
- **user_starred_repos**: 사용자와 즐겨찾기 저장소 관계
- **tags**: 사용자 정의 태그
- **repository_tags**: 저장소와 태그 관계

자세한 스키마는 `src/shared/types/database.ts`를 참조하세요.

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.