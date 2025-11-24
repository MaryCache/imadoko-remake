CREATE TABLE team (
    id BIGSERIAL PRIMARY KEY,
    team_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE player (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    position VARCHAR(255) NOT NULL,
    team_id BIGINT,
    CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES team(id)
);
