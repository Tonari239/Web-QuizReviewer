<?php
session_start();
require "../xml-exporter/db.php";

header("Content-Type: application/json");

if(!isset($_SESSION['user_guid'])){
        header('Content-Type: text/html');
	    header('Location: ../../index.php');//remove after testing
}

$quiz_id =  (int)$_GET['quiz_id'] ;

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