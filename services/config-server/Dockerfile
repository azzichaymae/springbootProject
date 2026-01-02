# FROM eclipse-temurin:21-jdk

# WORKDIR /app

# COPY services/config-server/pom.xml .
# COPY services/config-server/mvnw .
# COPY services/config-server/.mvn .mvn
# COPY services/config-server/src src

# COPY config-repo /config-repo

# RUN ./mvnw clean package -DskipTests

# RUN cp target/*.jar app.jar

# EXPOSE 8888

# CMD ["java", "-jar", "app.jar"]

FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY services/config-server/pom.xml .
COPY services/config-server/mvnw .
COPY services/config-server/.mvn .mvn
COPY services/config-server/src src

RUN ./mvnw clean package -DskipTests
RUN cp target/*.jar app.jar

EXPOSE 8888
CMD ["java", "-jar", "app.jar"]
