#!/bin/sh

# 이동할 디렉토리
cd /home/ubuntu/CustomOnlineLec

# 최신 코드 가져오기
git pull origin serverTest/#1

# Docker Compose 작업
# sudo docker-compose down
sudo docker compose up --build -d

# 불필요한 Docker 이미지 삭제
sudo docker image prune -f
