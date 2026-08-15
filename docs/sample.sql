-- ============================================================
-- 8. SAMPLE GAME MAP
-- ============================================================

INSERT INTO game_maps (
    name,
    description,
    width,
    height,
    start_x,
    start_y,
    escape_x,
    escape_y
)
VALUES (
    'Bank Heist - Level 1',
    'First Time Heist level',
    20,
    20,
    1,
    1,
    18,
    18
);


-- ============================================================
-- 9. SAMPLE GAME OBJECTS
-- ============================================================

-- Guard
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'GUARD',
    10,
    10,
    '{
        "speed": 2,
        "vision": 5
    }'::jsonb
);


-- CCTV
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'CCTV',
    5,
    5,
    '{
        "vision": 4
    }'::jsonb
);


-- Laser
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'LASER',
    8,
    8,
    '{
        "activeDuration": 10,
        "slowDuration": 15,
        "speedMultiplier": 0.5
    }'::jsonb
);


-- Hole
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'HOLE',
    12,
    12,
    '{
        "resetTo": "START_POSITION"
    }'::jsonb
);


-- Spikes
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'SPIKES',
    15,
    15,
    '{
        "instantDeath": true
    }'::jsonb
);


-- Diamond
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'DIAMOND',
    16,
    16,
    '{}'::jsonb
);


-- Escape
INSERT INTO game_objects (
    map_id,
    object_type,
    position_x,
    position_y,
    configuration
)
VALUES (
    1,
    'ESCAPE',
    18,
    18,
    '{}'::jsonb
);


-- ============================================================
-- 10. EXAMPLE USER
-- ============================================================

-- DO NOT store plain-text passwords.
-- password_hash should contain a BCrypt/Argon2 hash generated
-- by the Spring Boot application.

INSERT INTO users (
    username,
    email,
    password_hash,
    status
)
VALUES (
    'testplayer',
    'test@example.com',
    '$2a$10$EXAMPLE_HASH_REPLACE_FROM_SPRING_SECURITY',
    'ACTIVE'
);


-- ============================================================
-- 11. EXAMPLE PLAYER PROFILE
-- ============================================================

INSERT INTO player_profiles (
    user_id,
    display_name,
    avatar
)
VALUES (
    1,
    'Test Player',
    'default-avatar.png'
);


-- ============================================================
-- 12. EXAMPLE GAME SESSION
-- ============================================================

INSERT INTO game_sessions (
    user_id,
    map_id,
    status
)
VALUES (
    1,
    1,
    'RUNNING'
);


-- ============================================================
-- 13. EXAMPLE GAME EVENTS
-- ============================================================

INSERT INTO game_events (
    game_session_id,
    event_type,
    event_time,
    metadata
)
VALUES (
    1,
    'GAME_STARTED',
    CURRENT_TIMESTAMP,
    '{}'::jsonb
);


-- Example: Guard detected player
INSERT INTO game_events (
    game_session_id,
    event_type,
    object_id,
    event_time,
    metadata
)
VALUES (
    1,
    'GUARD_DETECTED',
    1,
    CURRENT_TIMESTAMP,
    '{
        "guardSpeed": 3,
        "guardVision": 7
    }'::jsonb
);


-- ============================================================
-- 14. USEFUL QUERIES
-- ============================================================

-- Get all objects for a map
SELECT *
FROM game_objects
WHERE map_id = 1
  AND is_active = TRUE;


-- Get all sessions of a player
SELECT *
FROM game_sessions
WHERE user_id = 1
ORDER BY started_at DESC;


-- Get events for a game
SELECT *
FROM game_events
WHERE game_session_id = 1
ORDER BY event_time;


-- Get completed games
SELECT *
FROM game_sessions
WHERE status = 'COMPLETED';


-- Get player's highest score
SELECT MAX(final_score) AS highest_score
FROM game_sessions
WHERE user_id = 1
  AND status = 'COMPLETED';


-- Find guards on a map
SELECT *
FROM game_objects
WHERE map_id = 1
  AND object_type = 'GUARD';


-- Find objects having a particular JSON configuration
SELECT *
FROM game_objects
WHERE configuration @> '{"vision": 5}';