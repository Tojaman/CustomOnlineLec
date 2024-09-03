
# FROM openjdk:17-jdk
# # FROM openjdk:17-alpine

# WORKDIR /.

# ARG JAR_FILE=*.jar
# COPY build/libs/*.jar spring-base.jar

# #EXPOSE 9201
# ENTRYPOINT ["java", "-jar", "/spring-base.jar", "--spring.profiles.active=dev"]
# # ENTRYPOINT ["gradlew", "bootRun", "--args='--spring.profiles.active=dev'"]

# 1단계: 빌드 단계
FROM gradle:7.6-jdk17 AS build

# 작업 디렉토리 설정
WORKDIR /.

# Gradle Wrapper 파일과 설정 파일을 복사
COPY gradle /./gradle
COPY gradlew /.
COPY build.gradle /.
COPY settings.gradle /.

# 의존성 캐싱을 위해 Gradle Wrapper 파일과 의존성 다운로드
RUN ./gradlew --version

# 나머지 소스 코드 복사
COPY src /./src

# 테스트를 제외한 빌드 실행
RUN ./gradlew build -x test

# 2단계: 최종 이미지
FROM openjdk:17-jdk

# 작업 디렉토리 설정
WORKDIR /.

# 빌드 단계에서 생성된 JAR 파일을 복사
COPY --from=build /./build/libs/*.jar spring-base.jar

# 포트 노출 (필요시)
# EXPOSE 9201

# JAR 파일 실행
ENTRYPOINT ["java", "-jar", "/./spring-base.jar", "--spring.profiles.active=dev"]
