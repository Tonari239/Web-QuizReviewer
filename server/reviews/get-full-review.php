<?php
require "../xml-exporter/db.php";

$quiz_id=(int)$_GET['quiz_id'];
$user=$_GET['user'];

$stmt=$pdo->prepare("
SELECT q.question_id,
q.question_text,
qr.review_text,
qr.difficulty,
qr.reviewer_user_guid
FROM questions q
LEFT JOIN question_reviews qr
ON qr.question_id=q.question_id
WHERE q.quiz_id=?
");

$stmt->execute([$quiz_id]);

$questions_data=$stmt->fetchAll(PDO::FETCH_ASSOC);

$formatted_questions=[];
$seen_questions=[];

foreach($questions_data as $row){
$q_id=$row['question_id'];

if(!in_array($q_id,$seen_questions)){
$formatted_questions[]=[
"question_id"=>$q_id,
"question_text"=>$row['question_text'],
"user_review"=>null,
"all_reviews"=>[]
];
$seen_questions[]=$q_id;
}

if($row['difficulty']!==null){
$review_entry=[
"review_text"=>$row['review_text'],
"difficulty"=>(int)$row['difficulty']
];

$formatted_questions[count($formatted_questions)-1]['all_reviews'][]=$review_entry;

if($row['reviewer_user_guid']===$user){
$formatted_questions[count($formatted_questions)-1]['user_review']=$review_entry;
}
}
}

echo json_encode([
"questions"=>$formatted_questions
]);