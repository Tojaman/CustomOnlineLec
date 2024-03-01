
FROM openjdk:17-jdk
# FROM openjdk:17-alpine

WORKDIR /.

ARG JAR_FILE=*.jar
COPY build/libs/*.jar spring-base.jar

#EXPOSE 9201
ENTRYPOINT ["java", "-jar", "/spring-base.jar", "--spring.profiles.active=dev"]
# ENTRYPOINT ["gradlew", "bootRun", "--args='--spring.profiles.active=dev'"]