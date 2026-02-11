<?php
require "../xml-exporter/db.php";

$quiz_id=(int)$_GET['quiz_id'];
$quiz_id = (int)$_GET['quiz_id'] ;
$stmt=$pdo->prepare("
SELECT r.*, u.username
FROM reviews r
JOIN users u ON r.reviewer_user_guid=u.user_guid
WHERE r.quiz_id=?
");

$stmt->execute([$quiz_id]);

echo json_encode([
"reviews"=>$stmt->fetchAll(PDO::FETCH_ASSOC)
]);