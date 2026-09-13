# ISIG (이식)
> 몸으로 익힌 일을, 말로 설명하지 못해 생기는 인수인계 문제를 푸는 대화형 AI 도구


## 동기 (Why)
군 복무 중 인수인계를 겪으며 느낀 문제: 대부분의 업무는 말이 아니라 몸으로 익힌 감각이라, 막상 후임에게 설명하려고 하면 어디서부터 말해야 할지 막막해진다. 결과적으로 문서화는 늘 부실하고, 다음 사람은 같은 시행착오를 반복한다.

이건 군대만의 문제가 아니라, 퇴사·이직·휴가로 담당자가 바뀌는 모든 조직에서 반복되는 문제다.

## 목표 (Goal)
사용자가 자기 업무를 편하게 "말하기"만 하면, AI가 빠진 부분(순서, 예외, 이유)을 되물어가며 대화를 이끌고, 최종적으로 다음 사람이 바로 쓸 수 있는 체크리스트/매뉴얼로 자동 정리해주는 웹 서비스를 만든다.

## 핵심 기능 (MVP 스코프 — 3개로 제한)
1. **대화형 인터뷰**: 사용자의 업무 설명에 대해 AI가 부족한 부분을 되묻는 질문을 동적으로 생성
2. **자동 문서화**: 대화가 쌓이면 AI가 체크리스트/매뉴얼 형태로 재구성
3. **공유**: 완성된 문서를 고유 링크로 공유

## 기술 스택
- **Framework**: Next.js (프론트+백엔드 단일 레포)
- **DB**: Supabase
- **AI**: Claude API (질문 생성 + 문서 생성)
- **배포**: Vercel
- **개발 환경**: GitHub Codespaces (개인 노트북 없이 브라우저에서 개발)

## 폴더 구조 (초안)
```
debrief/
├── app/
│   ├── page.tsx                # 랜딩
│   ├── interview/[id]/page.tsx # 인터뷰 세션 화면
│   ├── docs/[id]/page.tsx      # 완성된 문서 공유 화면
│   └── api/
│       ├── interview/route.ts  # 대화 처리 + AI 후속 질문 생성
│       └── generate-doc/route.ts # 최종 문서 생성
├── lib/
│   ├── supabase.ts
│   └── claude.ts
├── components/
└── README.md
```

## 데이터 모델 (초안)
- `sessions`: id, user_id, title, status, created_at
- `messages`: id, session_id, role(user/ai), content, created_at
- `documents`: id, session_id, content(markdown), share_slug, created_at

## 로드맵
1. 환경 세팅 & 데이터 모델 설계
2. 기본 인터뷰 플로우 구현 (AI 없이 하드코딩 질문으로 흐름 검증)
3. AI 인터뷰어 로직 통합 ← 핵심 차별점, 가장 시간 투입
4. 문서 자동 생성 기능
5. 공유 & 마이페이지 UI
6. 배포 & README 스토리텔링 (동기 → 문제 → 어려웠던 점)

---
*이 문서는 프로젝트 시작 시점의 기획안이며, 진행하면서 스코프가 조정될 수 있음.*
