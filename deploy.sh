#!/bin/sh

# 최신 코드 가져오기
git pull origin serverTest/#1


# Docker Compose 작업
cd /home/ubuntu/CustomOnlineLec
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

# 불필요한 Docker 이미지 삭제
sudo docker image prune -f
