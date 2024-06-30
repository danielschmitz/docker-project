DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Criação das tabelas
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Inserção de dados fictícios
INSERT INTO users (username, email) VALUES 
('user1', 'user1@example.com'),
('user2', 'user2@example.com');

INSERT INTO posts (user_id, title, content) VALUES 
(1, 'First Post', 'This is the content of the first post.'),
(2, 'Second Post', 'This is the content of the second post.');

INSERT INTO comments (post_id, user_id, comment) VALUES 
(1, 2, 'This is a comment on the first post.'),
(2, 1, 'This is a comment on the second post.');


