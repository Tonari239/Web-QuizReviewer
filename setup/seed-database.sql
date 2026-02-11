USE quizzer_db;

-- INSERT USERS
-- ============================================
-- User 1: john_doe (Password: Quiz123!)
-- User 2: jane_smith (Password: Study456!)
INSERT INTO users (user_guid, username, email, password_hash) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'john_doe', 'john.doe@example.com', '$2y$12$3YI7LhK9wu3O1beDzyofZu8l4yeXT0rqA1G2RkkmrNSkODqEwPJ/O'),
('550e8400-e29b-41d4-a716-446655440001', 'jane_smith', 'jane.smith@example.com', '$2y$12$4cTqgqcIyNUmkGZVxxcfAu1V2aekTtdePPPie06OCsQH1EPE0J9hK');


-- ============================================
-- INSERT QUIZZES
-- ============================================
INSERT INTO quizzes (quiz_name, creator_user_guid) VALUES
('JavaScript Fundamentals', '550e8400-e29b-41d4-a716-446655440000'),
('HTML & CSS Basics', '550e8400-e29b-41d4-a716-446655440000'),
('Database Design Principles', '550e8400-e29b-41d4-a716-446655440001'),
('Web Security Essentials', '550e8400-e29b-41d4-a716-446655440001'),
('PHP Programming', '550e8400-e29b-41d4-a716-446655440000');

-- ============================================
-- INSERT QUESTIONS FOR "JavaScript Fundamentals" (quiz_id: 1)
-- ============================================
INSERT INTO questions (quiz_id, question_text) VALUES
(1, 'What keyword is used to declare a constant in JavaScript?'),
(1, 'Which method is used to add an element to the end of an array?'),
(1, 'What does the "===" operator do in JavaScript?'),
(1, 'Which of the following is NOT a JavaScript data type?');

-- ============================================
-- INSERT OPTIONS FOR JavaScript Questions
-- ============================================
-- Question 1: What keyword is used to declare a constant?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(1, 'var', FALSE),
(1, 'let', FALSE),
(1, 'const', TRUE),
(1, 'constant', FALSE);

-- Question 2: Method to add element to end of array
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(2, 'push()', TRUE),
(2, 'pop()', FALSE),
(2, 'shift()', FALSE),
(2, 'unshift()', FALSE);

-- Question 3: What does === operator do?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(3, 'Compares values only', FALSE),
(3, 'Compares both value and type', TRUE),
(3, 'Assigns a value', FALSE),
(3, 'Checks if variable exists', FALSE);

-- Question 4: Which is NOT a JavaScript data type?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(4, 'String', FALSE),
(4, 'Boolean', FALSE),
(4, 'Character', TRUE),
(4, 'Undefined', FALSE);

-- ============================================
-- INSERT QUESTIONS FOR "HTML & CSS Basics" (quiz_id: 2)
-- ============================================
INSERT INTO questions (quiz_id, question_text) VALUES
(2, 'Which HTML tag is used for the largest heading?'),
(2, 'What does CSS stand for?'),
(2, 'Which CSS property controls the text size?'),
(2, 'What is the correct HTML element for inserting a line break?');

-- ============================================
-- INSERT OPTIONS FOR HTML & CSS Questions
-- ============================================
-- Question 5: Largest heading tag
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(5, '<h6>', FALSE),
(5, '<heading>', FALSE),
(5, '<h1>', TRUE),
(5, '<head>', FALSE);

-- Question 6: What does CSS stand for?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(6, 'Computer Style Sheets', FALSE),
(6, 'Cascading Style Sheets', TRUE),
(6, 'Creative Style Sheets', FALSE),
(6, 'Colorful Style Sheets', FALSE);

-- Question 7: CSS property for text size
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(7, 'text-size', FALSE),
(7, 'font-size', TRUE),
(7, 'text-style', FALSE),
(7, 'font-weight', FALSE);

-- Question 8: HTML element for line break
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(8, '<break>', FALSE),
(8, '<lb>', FALSE),
(8, '<br>', TRUE),
(8, '<linebreak>', FALSE);

-- ============================================
-- INSERT QUESTIONS FOR "Database Design Principles" (quiz_id: 3)
-- ============================================
INSERT INTO questions (quiz_id, question_text) VALUES
(3, 'What does ACID stand for in database transactions?'),
(3, 'What is a primary key?'),
(3, 'What is normalization in database design?'),
(3, 'What does a foreign key ensure?');

-- ============================================
-- INSERT OPTIONS FOR Database Questions
-- ============================================
-- Question 9: ACID acronym
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(9, 'Atomicity, Consistency, Isolation, Durability', TRUE),
(9, 'Access, Control, Integrity, Data', FALSE),
(9, 'Authentication, Confidentiality, Integrity, Data', FALSE),
(9, 'Availability, Consistency, Isolation, Distribution', FALSE);

-- Question 10: What is a primary key?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(10, 'A key that is used most frequently', FALSE),
(10, 'A unique identifier for a table record', TRUE),
(10, 'The first column in a table', FALSE),
(10, 'A key stored in a secure location', FALSE);

-- Question 11: What is normalization?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(11, 'Making database queries faster', FALSE),
(11, 'Converting data to uppercase', FALSE),
(11, 'Organizing data to reduce redundancy', TRUE),
(11, 'Creating backup copies of data', FALSE);

-- Question 12: What does foreign key ensure?
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(12, 'Data encryption', FALSE),
(12, 'Referential integrity between tables', TRUE),
(12, 'Faster query performance', FALSE),
(12, 'Unique values in a column', FALSE);

-- ============================================
-- INSERT QUESTIONS FOR "Web Security Essentials" (quiz_id: 4)
-- ============================================
INSERT INTO questions (quiz_id, question_text) VALUES
(4, 'What does XSS stand for?'),
(4, 'What is the purpose of SQL injection?'),
(4, 'Which HTTP header helps prevent clickjacking?'),
(4, 'What does HTTPS provide that HTTP does not?');

-- ============================================
-- INSERT OPTIONS FOR Security Questions
-- ============================================
-- Question 13: XSS acronym
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(13, 'Cross-Site Scripting', TRUE),
(13, 'External Style Sheets', FALSE),
(13, 'Extended Security System', FALSE),
(13, 'Cross-Server Synchronization', FALSE);

-- Question 14: Purpose of SQL injection
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(14, 'To improve database performance', FALSE),
(14, 'To manipulate or access database without authorization', TRUE),
(14, 'To backup database automatically', FALSE),
(14, 'To optimize SQL queries', FALSE);

-- Question 15: Header to prevent clickjacking
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(15, 'Content-Type', FALSE),
(15, 'X-Frame-Options', TRUE),
(15, 'Authorization', FALSE),
(15, 'Cache-Control', FALSE);

-- Question 16: What HTTPS provides
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(16, 'Faster loading times', FALSE),
(16, 'Better SEO ranking', FALSE),
(16, 'Encrypted communication', TRUE),
(16, 'Free SSL certificates', FALSE);

-- ============================================
-- INSERT QUESTIONS FOR "PHP Programming" (quiz_id: 5)
-- ============================================
INSERT INTO questions (quiz_id, question_text) VALUES
(5, 'What is the correct way to start a PHP code block?'),
(5, 'Which superglobal is used to collect form data sent via POST method?'),
(5, 'What function is used to connect to a MySQL database in PHP?'),
(5, 'How do you declare a variable in PHP?');

-- ============================================
-- INSERT OPTIONS FOR PHP Questions
-- ============================================
-- Question 17: PHP code block start
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(17, '<php>', FALSE),
(17, '<?php', TRUE),
(17, '<script php>', FALSE),
(17, '<%php%>', FALSE);

-- Question 18: POST superglobal
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(18, '$_GET', FALSE),
(18, '$_POST', TRUE),
(18, '$_REQUEST', FALSE),
(18, '$_FORM', FALSE);

-- Question 19: MySQL connection function
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(19, 'mysql_connect()', FALSE),
(19, 'new mysqli()', TRUE),
(19, 'db_connect()', FALSE),
(19, 'connect_mysql()', FALSE);

-- Question 20: Declare variable in PHP
INSERT INTO question_options (question_id, option_text, is_correct) VALUES
(20, 'var $name;', FALSE),
(20, '$name;', FALSE),
(20, '$name = value;', TRUE),
(20, 'variable $name;', FALSE);

-- ============================================
-- INSERT REVIEWS
-- ============================================
-- Jane reviews John's quizzes
INSERT INTO reviews (quiz_id, reviewer_user_guid, rating, review_text) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', 5, 'Excellent quiz! Really helped me understand JavaScript fundamentals. The questions are well-structured and cover all the basics.'),
(2, '550e8400-e29b-41d4-a716-446655440001', 4, 'Good coverage of HTML and CSS basics. Would love to see more advanced CSS topics in a follow-up quiz.');

-- John reviews Jane's quizzes
INSERT INTO reviews (quiz_id, reviewer_user_guid, rating, review_text) VALUES
(3, '550e8400-e29b-41d4-a716-446655440000', 5, 'Outstanding database quiz! The ACID and normalization questions were particularly helpful.'),
(4, '550e8400-e29b-41d4-a716-446655440000', 5, 'Critical information for any web developer. Every programmer should take this quiz!');

-- Cross-review for PHP quiz
INSERT INTO reviews (quiz_id, reviewer_user_guid, rating, review_text) VALUES
(5, '550e8400-e29b-41d4-a716-446655440001', 4, 'Solid introduction to PHP. The superglobal questions were especially useful.');


--Jane reviews her own quiz (should be allowed)
INSERT INTO reviews (quiz_id, reviewer_user_guid, rating, review_text) VALUES
(3, '550e8400-e29b-41d4-a716-446655440001', 5, 'I am very proud of this quiz! It covers essential database design principles that every developer should know. I hope it helps others as much as it helped me when I was learning.');
-- ============================================
-- INSERT QUESTION REVIEWS
-- ============================================

-- John reviews Jane's quiz with question reviews
INSERT INTO question_reviews (quiz_id, question_id, reviewer_user_guid, review_text, difficulty) VALUES
(3, 1, '550e8400-e29b-41d4-a716-446655440001', 'Great question! Clear and straightforward.', 2),
(3, 2, '550e8400-e29b-41d4-a716-446655440001', 'Good question, but could use an example.', 3),
(3, 3, '550e8400-e29b-41d4-a716-446655440001', 'Excellent question that tests both value and type comparison.', 4),
(3, 4, '550e8400-e29b-41d4-a716-446655440001', 'This question is a bit tricky for beginners.', 4);
-- To see complete quiz with questions and options:
-- SELECT 
--     q.quiz_name,
--     qu.question_text,
--     qo.option_text,
--     qo.is_correct
-- FROM quizzes q
-- JOIN questions qu ON q.quiz_id = qu.quiz_id
-- JOIN question_options qo ON qu.question_id = qo.question_id
-- ORDER BY q.quiz_id, qu.question_id, qo.option_id;
