# Time Heist

> A web-based time-heist game built with Angular and Spring Boot.

## Overview

Time Heist is a full-stack web game project. Players authenticate, start a game session, interact with the game world, complete objectives, and receive the final game result.

The project is being developed as an MVP with a focus on:

- User registration and login
- Game/session creation
- Interactive game UI
- Game state management
- Backend REST APIs
- PostgreSQL persistence
- Clean separation between frontend and backend
- Deployment-ready project structure

## Tech Stack

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- RxJS

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security/JWT for authentication

### Database

- PostgreSQL
- pgAdmin 4

### Build & Development

- Maven
- npm
- Git/GitHub
- Docker (optional)

## Architecture

```text
                    +-------------------+
                    |     Angular UI    |
                    |   localhost:4200  |
                    +---------+---------+
                              |
                              | REST API
                              v
                    +-------------------+
                    |   Spring Boot     |
                    |   localhost:8080  |
                    +---------+---------+
                              |
                       JPA / Hibernate
                              |
                              v
                    +-------------------+
                    |    PostgreSQL     |
                    |      time_heist   |
                    +-------------------+
```

## Core MVP Flow

```text
Register
   ↓
Login
   ↓
Create/Start Game
   ↓
Load Game State
   ↓
Play Game
   ↓
Complete Objectives
   ↓
Finish Game
   ↓
Save Result
   ↓
Show Result/Score
```

## Project Structure

```text
time-heist/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── ...
│
├── docker/
├── docs/
├── README.md
└── SETUP.md
```

## Game UI Structure

The game screen should be composed from independent Angular components rather than one large component.

Example:

```text
GameComponent
├── GameHudComponent
├── GameMapComponent
├── PlayerComponent
├── GameObjectivesComponent
├── TimerComponent
├── InventoryComponent
└── GameResultComponent
```

`GameComponent` acts as the container/orchestrator while individual components handle their own UI responsibilities.

## Backend Responsibilities

The Spring Boot application is responsible for:

- Authentication and authorization
- User management
- Game/session creation
- Game state persistence
- Game actions
- Game completion
- Score/result persistence
- Validation
- REST API exposure

Example API grouping:

```text
/api/auth
/api/users
/api/games
/api/games/{gameId}
/api/games/{gameId}/actions
/api/games/{gameId}/result
```

Exact endpoints should be finalized as the implementation evolves.

## Database

Development database:

```text
Database: time_heist
Host: localhost
Port: 5432
Username: postgres
```

The application should create/update development tables through the configured JPA strategy during MVP development.

For production, use controlled database migrations rather than relying on `ddl-auto=update`.

## Running Locally

See the complete setup instructions in:

```text
SETUP.md
```

Quick start:

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Expected URLs:

```text
Frontend: http://localhost:4200
Backend:  http://localhost:8080
```

## Development Principles

### 1. Keep game logic on the backend

The frontend should primarily handle presentation and user interaction. Important game rules, validation, scoring, and authoritative state should be controlled by the backend.

### 2. Keep game UI components small

Avoid putting the entire game into one Angular component. Separate HUD, map, player, timer, objectives, inventory, and result screens.

### 3. Minimize API calls during gameplay

Use APIs at meaningful state boundaries instead of making a request for every visual/UI change.

Typical calls:

```text
Login/Register
    ↓
Start Game
    ↓
Load Initial State
    ↓
Game Actions / Important State Changes
    ↓
Complete Game
    ↓
Persist Result
```

### 4. Never trust the frontend

The backend should validate important actions and calculate authoritative results.

## Authentication

The MVP includes:

- Register
- Login
- JWT-based authentication
- Protected game APIs

Authentication flow:

```text
Angular
   |
   | Login
   v
Spring Security
   |
   | JWT
   v
Angular
   |
   | Authorization: Bearer <token>
   v
Protected APIs
```

Never commit JWT secrets or database passwords to Git.

## Testing

Backend:

```bash
mvn test
```

Frontend:

```bash
npm test
```

Production frontend build:

```bash
npm run build
```

Backend package:

```bash
mvn clean package
```

## Docker

Docker can be used for local PostgreSQL:

```bash
docker run --name time-heist-postgres   -e POSTGRES_DB=time_heist   -e POSTGRES_USER=postgres   -e POSTGRES_PASSWORD=postgres   -p 5432:5432   -d postgres:17
```

## Deployment

The deployment architecture can evolve independently of local development.

Target deployment components:

```text
Angular Application
        |
        v
Backend / API
        |
        v
PostgreSQL
```

Environment-specific configuration should be provided through deployment environment variables.

## Security Notes

- Never commit passwords.
- Never commit JWT signing secrets.
- Validate all game actions server-side.
- Protect authenticated endpoints.
- Validate request payloads.
- Use HTTPS in production.
- Use secure CORS configuration.
- Use database migrations for production schema changes.

## Hackathon MVP Priorities

### Must Have

- [ ] Register
- [ ] Login
- [ ] Authentication
- [ ] Start game
- [ ] Game screen
- [ ] Timer
- [ ] Player/game interaction
- [ ] Objectives
- [ ] Game completion
- [ ] Result/score
- [ ] PostgreSQL persistence
- [ ] Working deployed application
- [ ] Demo video

### Nice to Have

- [ ] Leaderboard
- [ ] Multiple game levels
- [ ] Better animations
- [ ] Sound effects
- [ ] Advanced game mechanics
- [ ] Multiplayer functionality
- [ ] Analytics

## Contributing

1. Create a feature branch.
2. Implement the feature.
3. Add/update tests.
4. Verify the application locally.
5. Commit with a meaningful message.
6. Open a pull request.

Example:

```bash
git checkout -b feature/game-timer
git add .
git commit -m "feat: add game timer"
git push origin feature/game-timer
```

## License

Add the project's chosen license here.

## Status

🚧 **MVP in development**
