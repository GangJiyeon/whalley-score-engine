whalley-score/
│
├── apps/
│   └── web/                         # Next.js (App Router)
│       ├── src/
│       │   ├── app/                 # Next.js app router
│       │   │
│       │   ├── features/            # 기능 단위 UI
│       │   │   ├── score/            # 점수 계산 폼 / 결과
│       │   │   ├── map/              # 지도 + 국가 레이어
│       │   │   ├── countries/        # 국가 리스트 / 상세
│       │   │   └── history/          # 결과 히스토리 (쿠키/임시코드)
│       │   │
│       │   ├── shared/               # 전역 공용 영역
│       │   │   ├── ui/               # Button, Card 등 공용 컴포넌트
│       │   │   ├── lib/              # fetcher, env, utils
│       │   │   └── types/            # FE 공용 타입
│       │   │
│       │   └── styles/               # 글로벌 스타일
│       │
│       └── public/                   # 정적 파일
│
├── services/
│   └── api/                          # FastAPI
│       ├── app/
│       │   ├── main.py               # FastAPI entrypoint
│       │   │
│       │   ├── core/                 # 설정/로깅/에러/보안
│       │   │
│       │   ├── db/                   # DB 설정, ORM, migrations
│       │   │
│       │   ├── modules/              # 도메인별 모듈
│       │   │   ├── scoring/           # 점수 계산 도메인
│       │   │   │   ├── domain/        # 엔티티 / 값 객체 / 모델
│       │   │   │   ├── rules/         # 국가별 점수 룰 (JSON/YAML)
│       │   │   │   ├── service.py    # 점수 계산 로직
│       │   │   │   └── router.py     # /score API
│       │   │   │
│       │   │   ├── countries/
│       │   │   │   ├── domain/
│       │   │   │   ├── service.py
│       │   │   │   └── router.py     # /countries API
│       │   │   │
│       │   │   ├── recommendations/
│       │   │   │   ├── service.py    # 추천 / 랭킹 로직
│       │   │   │   └── router.py
│       │   │   │
│       │   │   └── sessions/
│       │   │       ├── service.py    # 비회원 세션 / 임시코드
│       │   │       └── router.py
│       │   │
│       │   └── tests/                # API 테스트
│       │
│       └── pyproject.toml
│
├── packages/
│   └── contracts/                    # FE/BE 공용 스키마
│       ├── score.schema.json
│       ├── country.schema.json
│       └── session.schema.json
│
├── infra/
│   ├── docker/                       # Dockerfile 모음
│   └── compose.yml                   # docker-compose
│
└── docs/
    ├── ARCHITECTURE.md               # 전체 구조 설명
    ├── DATA_SOURCES.md               # 국가/비자 데이터 출처
    └── RULES_GUIDE.md                # 점수 룰 작성 가이드
