<?php
require "../xml-exporter/db.php";

$attempt_id=(int)$_GET['attempt_id'];

$stmt=$pdo->prepare("
SELECT q.question_id,
q.question_text,
ua.selected_option_id,
qo1.option_text as user_selected_option_text,
qo2.option_text as correct_option_text,
qo2.option_id as correct_option_id
FROM quiz_attempts qa
JOIN user_answers ua ON qa.attempt_id=ua.attempt_id
JOIN questions q ON ua.question_id=q.question_id
JOIN question_options qo1 ON ua.selected_option_id=qo1.option_id
JOIN question_options qo2 ON qo2.question_id=q.question_id AND qo2.is_correct=TRUE
WHERE qa.attempt_id=?
ORDER BY q.question_id
");

$stmt->execute([$attempt_id]);

$results=$stmt->fetchAll(PDO::FETCH_ASSOC);

$formatted_results=[];

foreach($results as $row){
$formatted_results[]=[
"question_id"=>$row['question_id'],
"question_text"=>$row['question_text'],
"user_selected_option_id"=>(int)$row['selected_option_id'],
"user_selected_option_text"=>$row['user_selected_option_text'],
"correct_option_id"=>(int)$row['correct_option_id'],
"correct_option_text"=>$row['correct_option_text']
];
}

echo json_encode([
"questions"=>$formatted_results
]);
