

FROM openjdk:17-jdk

#ARG JAR_FILE=*.jar
COPY build/libs/*.jar spring-base.jar
#EXPOSE 9201
ENTRYPOINT ["java", "-jar", "/spring-base.jar"]
