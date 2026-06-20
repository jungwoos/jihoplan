# 지호 일정 (JihoPlan)

아이 일정을 가족·지인과 공유하는 캘린더 사이트. GitHub Pages(정적 호스팅)에서 동작하며,
일정 데이터는 저장소 안의 `data/schedule.json` 한 파일에 보관됩니다.

- **뷰어** (`/#/`): 월/주/일 토글 캘린더. 누구나 열람 가능, 로그인 불필요.
- **관리자** (`/#/admin`): GitHub 토큰으로 일정 추가/수정/삭제 후 저장 (토큰은 기기당 1회 입력).

배포 URL: https://jungwoos.github.io/jihoplan/

## 동작 방식

- 뷰어는 `raw.githubusercontent.com`에서 `data/schedule.json`을 직접 읽습니다(인증 불필요, CDN 캐시 ~5분).
- 관리자가 "GitHub에 저장"을 누르면 GitHub Contents API로 `data/schedule.json`을 커밋합니다.
- 커밋이 `main`에 들어가면 GitHub Actions가 사이트를 다시 빌드/배포합니다.

## 로컬 개발

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # 타입체크 + 프로덕션 빌드
```

## 관리자 사용법

별도 비밀번호는 없습니다. **GitHub 토큰 보유 = 편집 권한**이며, 기기마다 최초 1회만 입력하면 됩니다.

1. `/#/admin` 접속 → GitHub **fine-grained** 개인 토큰 입력. 권한은 이 저장소(`jungwoos/jihoplan`) **Contents: Read and write** 만 부여하고 만료일을 설정하세요.
2. `이 기기에서 기억하기`(기본 체크) 상태로 시작하면 이 브라우저에 저장되어 다음부터는 `/#/admin`이 바로 편집 화면으로 열립니다.
3. 캘린더에서 빈 칸 드래그(추가) / 일정 클릭(수정·삭제) / 드래그로 시간 변경 → **GitHub에 저장**.
4. 저장된 토큰을 지우려면 관리자 화면의 **로그아웃**을 누릅니다(해당 기기에서만 삭제).

## 보안 메모

- 인증 게이트는 토큰뿐입니다. 토큰이 없는 방문자는 `/#/admin`에서 입력 화면만 보며 저장할 수 없습니다.
- 토큰은 브라우저(session/localStorage)에만 저장되며 저장소에 커밋되지 않습니다.
- 공개 저장소이므로 일정은 누구나 열람할 수 있습니다. 민감 정보는 넣지 마세요.

## 데이터 모델 (`data/schedule.json`)

```jsonc
{
  "version": 1,
  "updatedAt": "ISO 8601",
  "categories": [{ "id": "...", "label": "...", "color": "#..." }],
  "events": [{
    "id": "evt_...", "title": "...",
    "start": "2026-06-19T16:00:00", "end": "2026-06-19T17:00:00",
    "allDay": false, "categoryId": "...", "color": "#...",
    "location": "...", "notes": "...", "rrule": null
  }]
}
```

`rrule`은 반복 일정을 위한 예약 필드입니다(현재 미사용).
