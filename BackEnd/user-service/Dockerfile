# 1st stage: Build using Maven
FROM maven:3.9.6-eclipse-temurin-24 as builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn clean package -DskipTests

# 2nd stage: runtime
FROM eclipse-temurin:24-jdk-jammy

WORKDIR /app

COPY --from=builder /app/target/user-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"]
