#!/usr/bin/env bash
# QR/멤버십 백엔드 수동 테스트용. 사용 전: export TOKEN="..." (로그인해서 받은 액세스 토큰)
# 사용법: ./api.sh <command> [args...]
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000/api}"
TOKEN="${TOKEN:-}"

auth=()
if [ -n "$TOKEN" ]; then
  auth=(-H "Authorization: Bearer $TOKEN")
fi

cmd="${1:-}"
shift || true

case "$cmd" in
  welfares)
    curl -s "$BASE_URL/welfares" | jq
    ;;
  me)
    curl -s "$BASE_URL/memberships/me" "${auth[@]}" | jq
    ;;
  scan)
    code="${1:?사용법: scan <code>}"
    curl -s -X POST "$BASE_URL/memberships/scan" "${auth[@]}" \
      -H "Content-Type: application/json" -d "{\"code\":\"$code\"}" | jq
    ;;
  issue-code)
    welfareId="${1:?사용법: issue-code <welfareId>}"
    curl -s -X POST "$BASE_URL/welfares/$welfareId/invite-code" "${auth[@]}" | jq
    ;;
  get-code)
    welfareId="${1:?사용법: get-code <welfareId>}"
    curl -s "$BASE_URL/welfares/$welfareId/invite-code" "${auth[@]}" | jq
    ;;
  pending)
    welfareId="${1:?사용법: pending <welfareId>}"
    curl -s "$BASE_URL/welfares/$welfareId/memberships?status=pending" "${auth[@]}" | jq
    ;;
  approve)
    welfareId="${1:?사용법: approve <welfareId> <membershipId> [role=member]}"
    membershipId="${2:?사용법: approve <welfareId> <membershipId> [role=member]}"
    role="${3:-member}"
    curl -s -X PATCH "$BASE_URL/welfares/$welfareId/memberships/$membershipId" "${auth[@]}" \
      -H "Content-Type: application/json" -d "{\"role\":\"$role\"}" | jq
    ;;
  *)
    cat <<EOF
사용법: $0 <command> [args...]

  welfares                                  복지관 목록
  me                                        내 복지관 목록 (인증 필요)
  scan <code>                               QR 스캔 (인증 필요)
  issue-code <welfareId>                    QR 발급/재발급 (admin/super 필요)
  get-code <welfareId>                      QR 조회 (admin/super 필요)
  pending <welfareId>                       검토 대기 회원 목록 (admin/super 필요)
  approve <welfareId> <membershipId> [role] 역할 지정/승인 (admin/super 필요)

인증 필요한 명령 전에: export TOKEN="로그인 응답의 accessToken"
EOF
    ;;
esac
