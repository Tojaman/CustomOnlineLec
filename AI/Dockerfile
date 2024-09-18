# # NVIDIA CUDA 기반 이미지 선택
# FROM nvidia/cuda:11.8.0-base-ubuntu22.04

# # 환경 변수 설정
# ENV DEBIAN_FRONTEND=noninteractive

# # 패키지 목록 업데이트 및 필수 패키지 설치
# # RUN apt-get update && \
# #     apt-get install -y \
# #     libnvidia-common-470 \
# #     libnvidia-gl-470 \
# #     nvidia-driver-470-server \
# #     python3 \
# #     python3-pip \
# #     python3-dev \
# #     build-essential \
# #     && apt-get clean

# # nvidia/cuda 기반 이미지는 이미 CUDA 런타임을 포함하고 있다.
# # 따라서 libnvidia-common-470, libnvidia-gl-470, nvidia-driver-470-server 제거 
# # git, ffmpeg: whisper 설치에 필요
# # requirements.txt에 있는 sox는 제대로 설치가 안됨
# RUN apt-get update && \
#     apt-get install -y \
#     python3 \
#     python3-pip \
#     python3-dev \
#     build-essential \
#     git \ 
#     ffmpeg \
#     sox \
#     && apt-get clean

# # 작업 디렉토리 설정
# WORKDIR /AI

# # 의존성 파일 복사
# COPY requirements.txt .

# # pip 업그레이드 및 패키지 설치 -> requirements.txt의 fairseq를 설치하는데 omegaconf 2.0.6 버전 설치가 필요한데 이때 pip 24.1 미만 버전이 필요함. 따라서 24.0 버전으로 설치
# # RUN pip install --upgrade pip
# RUN pip install --upgrade pip==24.0
# RUN pip install --no-cache-dir -r requirements.txt


# # 추가 패키지 설치
# # RUN pip install python-dotenv

# # .env 파일 복사
# COPY .env ./

# # Flask 애플리케이션 코드 복사
# COPY . /AI

# ## Flask와 필요한 Python 패키지 설치
# #RUN pip3 install --no-cache-dir flask

# # Flask 애플리케이션 실행
# CMD ["python3", "main.py"]

# # 컨테이너에서 사용하는 포트 열기
# EXPOSE 5000

# -----------------------
FROM python:3.10

# Set working directory
WORKDIR /AI

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip==24.0
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install python-dotenv

COPY .env ./
# Flask 애플리케이션 코드 복사
COPY . /AI
RUN pip3 install --no-cache-dir flask
CMD ["python3", "main.py"]