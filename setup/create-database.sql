
CREATE DATABASE quizzer_db;
USE quizzer_db;

CREATE TABLE users (
    user_guid VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE quizzes (
    quiz_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_name VARCHAR(255) NOT NULL,
    creator_user_guid VARCHAR(36) NOT NULL,
    FOREIGN KEY (creator_user_guid) REFERENCES users(user_guid) ON DELETE CASCADE
);

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text TEXT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

CREATE TABLE question_options (
    option_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    option_text VARCHAR(500) NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT NOT NULL,
    reviewer_user_guid VARCHAR(36) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_user_guid) REFERENCES users(user_guid) ON DELETE CASCADE,
    UNIQUE(quiz_id, reviewer_user_guid)
);

-- NEW TABLE ADDED FOR QUESTION REVIEWS

CREATE TABLE question_reviews (
    question_review_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    reviewer_user_guid VARCHAR(36) NOT NULL,
    review_text TEXT,
    difficulty INT CHECK (difficulty >= 1 AND difficulty <= 5),

    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_user_guid) REFERENCES users(user_guid) ON DELETE CASCADE,

    UNIQUE(question_id, reviewer_user_guid)
);