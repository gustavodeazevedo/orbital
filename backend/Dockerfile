# Build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

COPY backend/gradle backend/gradle
COPY backend/gradlew backend/gradlew
COPY backend/gradlew.bat backend/gradlew.bat
COPY backend/build.gradle backend/settings.gradle backend/
COPY backend/src backend/src

WORKDIR /app/backend
RUN chmod +x ./gradlew \
    && ./gradlew bootJar -x test \
    && JAR_PATH=$(ls build/libs/*.jar | grep -v plain | head -n 1) \
    && cp "$JAR_PATH" /app/app.jar

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/app.jar /app/app.jar

EXPOSE 8080
CMD ["java", "-jar", "/app/app.jar"]
