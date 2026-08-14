# Time Heist - Setup Guide

## 1. Prerequisites

Install the following before starting development:

- Java 17+
- Node.js 20.19+ (or a version supported by your Angular version)
- npm
- Maven 3.9+
- PostgreSQL 16/17
- pgAdmin 4 (optional)
- Git
- Docker Desktop (optional, recommended for PostgreSQL)

Verify installations:

```bash
java -version
node -v
npm -v
mvn -version
psql --version
git --version
```

## 2. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd time-heist
```

## 3. Repository Structure

The project is organized as a frontend/backend application:

```text
time-heist/
├── backend/                 # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── ...
├── frontend/                # Angular application
│   ├── src/
│   ├── package.json
│   └── ...
├── docker/                  # Optional Docker configuration
├── docs/                    # Project documentation
├── README.md
└── SETUP.md
```

Adjust folder names if the repository uses a different structure.

## 4. PostgreSQL Setup

### Option A - Local PostgreSQL

Create the database:

```sql
CREATE DATABASE time_heist;
```

Verify it:

```bash
psql -U postgres -d time_heist
```

### Option B - Docker PostgreSQL

Example:

```bash
docker run --name time-heist-postgres   -e POSTGRES_DB=time_heist   -e POSTGRES_USER=postgres   -e POSTGRES_PASSWORD=postgres   -p 5432:5432   -d postgres:17
```

Check that the container is running:

```bash
docker ps
```

## 5. Backend Configuration

Create/update the Spring Boot configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/time_heist
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

For shared environments, do not commit real passwords. Prefer environment variables or a local, ignored configuration file.

Example:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/time_heist}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
```

Make sure the PostgreSQL JDBC dependency exists in `pom.xml`:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

Build the backend:

```bash
cd backend
mvn clean install
```

Run it:

```bash
mvn spring-boot:run
```

The backend should normally start on:

```text
http://localhost:8080
```

## 6. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Start Angular:

```bash
npm start
```

or:

```bash
ng serve
```

The frontend should normally be available at:

```text
http://localhost:4200
```

## 7. Frontend-to-Backend Configuration

Configure the Angular environment/API base URL to point to the Spring Boot application:

```text
http://localhost:8080
```

If the frontend uses a proxy configuration, start it with the project's configured npm command.

## 8. Verify the Application

Check the following:

1. PostgreSQL is running.
2. `time_heist` database exists.
3. Backend starts without datasource/Hibernate errors.
4. Frontend starts successfully.
5. Frontend can call the backend API.
6. Register/login flow works.
7. A game/session can be created.
8. The game screen loads.
9. Game completion is persisted.

## 9. Common Problems

### PostgreSQL connection refused

Check:

```bash
netstat -ano | findstr :5432
```

If PostgreSQL is in Docker:

```bash
docker ps
```

### Database does not exist

Create it:

```sql
CREATE DATABASE time_heist;
```

### Hibernate cannot determine dialect

First verify the datasource connection and PostgreSQL JDBC driver. Do not treat the Hibernate dialect message as the primary problem until the database connection is confirmed.

### Port 8080 already in use

Find the process:

```bash
netstat -ano | findstr :8080
```

Either stop that process or configure another Spring Boot port.

### Port 4200 already in use

Start Angular on another port:

```bash
ng serve --port 4201
```

## 10. Development Workflow

Recommended order:

1. Start PostgreSQL.
2. Start Spring Boot backend.
3. Start Angular frontend.
4. Develop/test the feature.
5. Run backend tests.
6. Run frontend tests/build.
7. Commit changes with a meaningful Git message.

## 11. Environment Variables

Never commit production credentials.

Recommended variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
CORS_ALLOWED_ORIGINS
```

Keep local secrets in an ignored environment/configuration file.

## 12. Production

Before deployment:

```bash
mvn clean package
```

For Angular:

```bash
npm run build
```

Use production database credentials and environment-specific configuration. Never use the development PostgreSQL password in production.
