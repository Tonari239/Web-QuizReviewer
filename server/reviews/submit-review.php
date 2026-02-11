<?php
session_start();
require "../xml-exporter/db.php";

$user_guid = $_SESSION['user_guid'];

$quiz_id = (int)$_POST['quiz_id'];
$general_review = $_POST['general_review'];
$quiz_rating = (int)($_POST['quiz_rating'] ?? 0);
$quiz_rating = $quiz_rating==0 ? null : $quiz_rating;

$question_reviews = $_POST['question_reviews'];
$question_difficulty = $_POST['question_difficulty'];


// --------------------
// Save quiz review
// --------------------
$stmt = $pdo->prepare("
INSERT INTO reviews (quiz_id, reviewer_user_guid, rating, review_text)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
rating = VALUES(rating),
review_text = VALUES(review_text)
");

$stmt->execute([
$quiz_id,
$user_guid,
$quiz_rating,
$general_review
]);


// --------------------
// Save question reviews
// --------------------
foreach($question_reviews as $qid=>$text){

if(trim($text) === '') continue;

$difficulty = $question_difficulty[$qid] ?? null;

$difficulty = ($difficulty == 0) ? null : $difficulty;
$stmt = $pdo->prepare("
INSERT INTO question_reviews
(question_id, reviewer_user_guid, review_text, difficulty)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
review_text = VALUES(review_text),
difficulty = VALUES(difficulty)
");

$stmt->execute([$qid,$user_guid,$text,$difficulty]);

}

header("Location: ../../client/landing/landing.html");
exit;