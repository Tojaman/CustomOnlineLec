FROM openjdk:17-jdk

# 작업 디렉토리 설정
WORKDIR /.

# 빌드 단계에서 생성된 JAR 파일을 복사
# COPY --from=build /./build/libs/*.jar spring-base.jar
COPY ./build/libs/spring-base.jar spring-base.jar

# 포트 노출 (필요시)
# EXPOSE 9201

# JAR 파일 실행
ENTRYPOINT ["java", "-jar", "/./spring-base.jar", "--spring.profiles.active=dev"]
