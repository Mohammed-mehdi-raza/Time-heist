-- ============================================================
-- TIME HEIST - DATABASE SCHEMA
-- Database: PostgreSQL
-- ============================================================

-- Optional: create a dedicated schema
-- CREATE SCHEMA IF NOT EXISTS time_heist;

-- SET search_path TO time_heist;


CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);


CREATE TABLE player_profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    display_name VARCHAR(100),
    avatar VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_player_profile_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE game_maps (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    width INT NOT NULL,
    height INT NOT NULL,
    start_x INT NOT NULL,
    start_y INT NOT NULL,
    escape_x INT NOT NULL,
    escape_y INT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_game_maps_width
        CHECK (width > 0),

    CONSTRAINT chk_game_maps_height
        CHECK (height > 0),

    CONSTRAINT chk_start_x
        CHECK (start_x >= 0 AND start_x < width),

    CONSTRAINT chk_start_y
        CHECK (start_y >= 0 AND start_y < height),

    CONSTRAINT chk_escape_x
        CHECK (escape_x >= 0 AND escape_x < width),

    CONSTRAINT chk_escape_y
        CHECK (escape_y >= 0 AND escape_y < height)
);


CREATE TABLE game_objects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    map_id BIGINT NOT NULL,
    object_type VARCHAR(50) NOT NULL,
    position_x INT NOT NULL,
    position_y INT NOT NULL,
    configuration JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_game_object_map
        FOREIGN KEY (map_id)
        REFERENCES game_maps(id)
        ON DELETE CASCADE
);


CREATE TABLE game_sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    map_id BIGINT NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'RUNNING',
    diamond_stolen BOOLEAN NOT NULL DEFAULT FALSE,
    final_score INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_game_session_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_session_map
        FOREIGN KEY (map_id)
        REFERENCES game_maps(id)
        ON DELETE RESTRICT
);


CREATE TABLE game_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_session_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    object_id BIGINT,
    event_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,

    CONSTRAINT fk_game_event_session
        FOREIGN KEY (game_session_id)
        REFERENCES game_sessions(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_event_object
        FOREIGN KEY (object_id)
        REFERENCES game_objects(id)
        ON DELETE SET NULL
);


-- ============================================================
-- 7. INDEXES
-- ============================================================

-- USERS
CREATE INDEX idx_users_username
    ON users(username);

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_users_status
    ON users(status);


-- PLAYER PROFILES
CREATE INDEX idx_player_profiles_user_id
    ON player_profiles(user_id);


-- GAME MAPS
CREATE INDEX idx_game_maps_active
    ON game_maps(is_active);


-- GAME OBJECTS
CREATE INDEX idx_game_objects_map_id
    ON game_objects(map_id);

CREATE INDEX idx_game_objects_type
    ON game_objects(object_type);

CREATE INDEX idx_game_objects_map_type
    ON game_objects(map_id, object_type);


-- JSONB configuration
CREATE INDEX idx_game_objects_configuration
    ON game_objects
    USING GIN(configuration);


-- GAME SESSIONS
CREATE INDEX idx_game_sessions_user_id
    ON game_sessions(user_id);

CREATE INDEX idx_game_sessions_map_id
    ON game_sessions(map_id);

CREATE INDEX idx_game_sessions_status
    ON game_sessions(status);

CREATE INDEX idx_game_sessions_user_status
    ON game_sessions(user_id, status);

CREATE INDEX idx_game_sessions_started_at
    ON game_sessions(started_at);


-- GAME EVENTS
CREATE INDEX idx_game_events_session_id
    ON game_events(game_session_id);

CREATE INDEX idx_game_events_type
    ON game_events(event_type);

CREATE INDEX idx_game_events_object_id
    ON game_events(object_id);

CREATE INDEX idx_game_events_session_time
    ON game_events(game_session_id, event_time);
