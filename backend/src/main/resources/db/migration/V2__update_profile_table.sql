ALTER TABLE player_profiles
    ADD COLUMN IF NOT EXISTS bio varchar(500);