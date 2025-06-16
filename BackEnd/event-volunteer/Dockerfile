# 1st stage: build using Maven inside container
FROM maven:3.9.6-eclipse-temurin-24 as builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Package application
RUN mvn clean package -DskipTests

# 2nd stage: runtime image
FROM eclipse-temurin:24-jdk-jammy

WORKDIR /app

# Copy jar file from builder stage
COPY --from=builder /app/target/event-volunteer-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]
