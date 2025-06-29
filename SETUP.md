# Rewrite Stars - 프로젝트 설정 가이드

새로운 Rewrite Stars 프로젝트를 설정하기 위한 단계별 가이드입니다.

## 📋 설정 체크리스트

### ✅ 1. 데이터베이스 설정

1. **Supabase 프로젝트 생성**
   - [supabase.com](https://supabase.com)에서 새 프로젝트 생성
   - 프로젝트 이름: `rewrite-stars` (또는 원하는 이름)

2. **데이터베이스 스키마 적용**
   - Supabase 대시보드 → SQL Editor 이동
   - `database-schema-fixed.sql` 파일의 내용을 복사하여 실행
   - 성공 메시지 확인: "Database schema created successfully with fixed RLS policies!"

   > **중요**: `database-schema-fixed.sql` 파일을 사용하세요. 이 파일은 RLS 정책 오류를 수정하고 서버사이드 작업을 위한 service role 접근을 허용합니다.

3. **Supabase 설정값 복사**
   - Project Settings → API에서 다음 값들을 복사:
     - `URL`: `SUPABASE_URL`에 사용
     - `anon public`: `SUPABASE_ANON_KEY`에 사용
     - `service_role`: `SUPABASE_SERVICE_ROLE_KEY`에 사용

### ✅ 2. GitHub OAuth 앱 설정

1. **GitHub OAuth 앱 생성**
   - GitHub → Settings → Developer settings → OAuth Apps
   - "New OAuth App" 클릭

2. **OAuth 앱 설정**
   ```
   Application name: Rewrite Stars
   Homepage URL: http://localhost:3000
   Application description: GitHub starred repositories dashboard
   Authorization callback URL: http://localhost:3000/api/auth/github/callback
   ```

3. **클라이언트 정보 복사**
   - `Client ID`: `GITHUB_CLIENT_ID`에 사용
   - `Client Secret`: `GITHUB_CLIENT_SECRET`에 사용

### ✅ 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Encryption for sensitive data
ENCRYPTION_KEY=your_32_character_encryption_key_here

# App Configuration
NEXT_PUBLIC_APP_NAME="Rewrite Stars"
NEXT_PUBLIC_APP_DESCRIPTION="Transform your GitHub starred repositories into a beautiful, organized dashboard"
```

**환경변수 생성 도구:**

```bash
# NextAuth Secret 생성
openssl rand -base64 32

# Encryption Key 생성 (32자)
openssl rand -hex 16
```

### ✅ 4. 로컬 개발 환경 실행

```bash
# 의존성 설치
bun install

# 개발 서버 실행
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### ✅ 5. 기본 테스트

1. **홈페이지 접속** - 페이지가 정상적으로 로드되는지 확인
2. **로그인 테스트** - GitHub OAuth 로그인이 작동하는지 확인
3. **대시보드 접속** - 로그인 후 대시보드가 표시되는지 확인
4. **저장소 동기화** - GitHub 저장소가 정상적으로 가져와지는지 확인

## 🔧 추가 설정 (선택사항)

### Vercel 배포 설정

1. **Vercel 프로젝트 생성**
   - GitHub 저장소와 연결
   - 환경변수 추가 (프로덕션용 URL로 수정)

2. **프로덕션 환경변수**
   ```bash
   GITHUB_CALLBACK_URL=https://your-domain.vercel.app/api/auth/github/callback
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **GitHub OAuth 앱 업데이트**
   - Homepage URL: `https://your-domain.vercel.app`
   - Callback URL: `https://your-domain.vercel.app/api/auth/github/callback`

### 개발 도구 설정

```bash
# 린팅 실행
bun lint

# 타입 체크
bun type-check

# 빌드 테스트
bun build
```

## 🐛 문제 해결

### 자주 발생하는 문제들

1. **"new row violates row-level security policy" 오류**
   - `database-schema-fixed.sql` 파일을 사용했는지 확인
   - 이 파일은 service role 접근을 허용하여 서버사이드 작업을 지원합니다
   - 기존 테이블이 있다면 먼저 삭제하고 새로 생성하세요

2. **"Invalid client_id" 오류**
   - GitHub OAuth 앱 설정 확인
   - `GITHUB_CLIENT_ID` 환경변수 확인

3. **Supabase 연결 오류**
   - Supabase URL과 키 확인
   - 네트워크 연결 상태 확인

4. **환경변수 인식 안됨**
   - `.env.local` 파일 위치 확인 (프로젝트 루트)
   - 서버 재시작 후 다시 테스트

### 로그 확인 방법

```bash
# 개발 서버 로그
bun dev

# 상세 로그
DEBUG=* bun dev

# 특정 모듈 로그
DEBUG=next:* bun dev
```

## 📚 참고 자료

- [Next.js 14 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [GitHub OAuth 문서](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [NextAuth.js 문서](https://next-auth.js.org/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

## 🆕 변경사항 (RLS 정책 수정)

### 수정된 내용
- **RLS 정책 개선**: 서버사이드 작업을 위한 service role 접근 허용
- **자동 사용자 생성**: OAuth 인증 시 자동으로 사용자 레코드 생성
- **공개 대시보드 지원**: 공개 읽기 권한으로 대시보드 공유 기능 지원
- **데이터베이스 스키마 최적화**: 정규화된 테이블 구조로 성능 향상

### 주요 개선사항
- ✅ "new row violates row-level security policy" 오류 해결
- ✅ GitHub OAuth 로그인 시 자동 사용자 생성
- ✅ 서버사이드 API에서 데이터베이스 접근 가능
- ✅ 공개 대시보드 공유 기능 지원

## 🎉 설정 완료!

모든 단계를 완료했다면 이제 Rewrite Stars 프로젝트를 사용할 준비가 되었습니다!

- GitHub에 로그인하여 저장소를 동기화하세요
- 커스텀 태그를 만들어 저장소를 정리하세요
- 공개 대시보드를 통해 다른 사람들과 공유하세요 