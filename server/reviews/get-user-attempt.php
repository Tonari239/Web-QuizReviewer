<?php
session_start();
require "../xml-exporter/db.php";

header("Content-Type: application/json");

$userGuid = $_SESSION['user_guid'] ?? null;
$quizId = isset($_GET['quiz_id']) ? (int)$_GET['quiz_id'] : 0;

if(!$userGuid || !$quizId){
    echo json_encode(["error"=>"Missing data"]);
    exit;
}

$stmt = $pdo->prepare("
    SELECT attempt_id 
    FROM quiz_attempts
    WHERE user_guid = ? AND quiz_id = ?
    ORDER BY submitted_at DESC
    LIMIT 1
");

$stmt->execute([$userGuid,$quizId]);

$attempt = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    "attempt_id"=>$attempt['attempt_id'] ?? null
]);