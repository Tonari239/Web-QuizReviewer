<?php
session_start();
require "../xml-exporter/db.php";

header("Content-Type: application/json");

if(!isset($_SESSION['user_guid'])){
    $_SESSION['user_guid']='550e8400-e29b-41d4-a716-446655440001';//remove after testing
}

$quiz_id = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 3;//remove default quiz_id after testing

$stmt = $pdo->prepare("
SELECT question_id, question_text
FROM questions
WHERE quiz_id = ?
");

$stmt->execute([$quiz_id]);
$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    "quiz_id"=>$quiz_id,
    "questions"=>$questions
]);