#!/bin/bash
# API 서버 블루그린 배포. EC2 안에서 SSH로 실행됨.
# 사용: deploy-api.sh <env> <image> <blue_port> <green_port>
# env는 dev/prod, image는 docker pull 가능한 전체 이미지명(예: user/repo:server-latest)
set -euo pipefail

ENV=$1
IMAGE=$2
BLUE_PORT=$3
GREEN_PORT=$4

STATE_FILE="/opt/app/${ENV}_active_port"
NGINX_CONF="/etc/nginx/conf.d/${ENV}.conf"
CONTAINER_PREFIX="welfare-api-${ENV}"

sudo mkdir -p /opt/app

if [ -f "$STATE_FILE" ]; then
  ACTIVE_PORT=$(cat "$STATE_FILE")
else
  ACTIVE_PORT=$BLUE_PORT
fi

if [ "$ACTIVE_PORT" == "$BLUE_PORT" ]; then
  NEW_PORT=$GREEN_PORT
else
  NEW_PORT=$BLUE_PORT
fi

echo "현재 활성 포트: $ACTIVE_PORT, 새로 배포할 포트: $NEW_PORT"

docker pull "$IMAGE"

docker rm -f "${CONTAINER_PREFIX}-${NEW_PORT}" 2>/dev/null || true

docker run -d \
  --name "${CONTAINER_PREFIX}-${NEW_PORT}" \
  -p "${NEW_PORT}:8000" \
  -e MONGODB_URL="$MONGODB_URL" \
  -e JWT_SECRET_KEY="$JWT_SECRET_KEY" \
  -e KAKAO_REST_API_KEY="$KAKAO_REST_API_KEY" \
  -e KAKAO_REDIRECT_URI="$KAKAO_REDIRECT_URI" \
  "$IMAGE"

echo "헬스체크 대기 중..."
HEALTHY=0
for i in $(seq 1 30); do
  if curl -sf "http://localhost:${NEW_PORT}/health" > /dev/null; then
    HEALTHY=1
    break
  fi
  sleep 2
done

if [ "$HEALTHY" -ne 1 ]; then
  echo "헬스체크 실패, 컨테이너 로그:"
  docker logs "${CONTAINER_PREFIX}-${NEW_PORT}"
  echo "새 컨테이너 정리하고 중단"
  docker rm -f "${CONTAINER_PREFIX}-${NEW_PORT}"
  exit 1
fi

echo "헬스체크 통과, nginx 전환"
sudo sed -i "s/127\.0\.0\.1:${ACTIVE_PORT}/127.0.0.1:${NEW_PORT}/" "$NGINX_CONF"
sudo nginx -t
sudo systemctl reload nginx

echo "$NEW_PORT" | sudo tee "$STATE_FILE" > /dev/null

docker rm -f "${CONTAINER_PREFIX}-${ACTIVE_PORT}" 2>/dev/null || true
docker image prune -af

echo "배포 완료. 활성 포트: $NEW_PORT"
