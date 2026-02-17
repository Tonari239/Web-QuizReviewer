<?php
session_start();
require "db.php";

if (!isset($_POST['quiz_id'])) {
    die("Quiz not selected");
}

$quiz_id = (int)$_POST['quiz_id'];
$user_guid = $_SESSION['user_guid'];


// --------------------------------------------------
// Validate ownership
// --------------------------------------------------
$stmt = $pdo->prepare("
    SELECT *
    FROM quizzes
    WHERE quiz_id = ?
    AND creator_user_guid = ?
");
$stmt->execute([$quiz_id, $user_guid]);
$quiz = $stmt->fetch();

if (!$quiz) {
    die("Invalid quiz");
}


// --------------------------------------------------
// Fetch Questions + Options
// --------------------------------------------------
$stmt = $pdo->prepare("
    SELECT 
        q.question_id,
        q.question_text,
        o.option_text,
        o.is_correct
    FROM questions q
    JOIN question_options o ON q.question_id = o.question_id
    WHERE q.quiz_id = ?
    ORDER BY q.question_id, o.option_id
");
$stmt->execute([$quiz_id]);
$data = $stmt->fetchAll();


// --------------------------------------------------
// Group Questions
// --------------------------------------------------
$questions = [];

foreach ($data as $row) {
    $qid = $row['question_id'];

    if (!isset($questions[$qid])) {
        $questions[$qid] = [
            "text" => $row['question_text'],
            "options" => []
        ];
    }

    $questions[$qid]["options"][] = [
        "text" => $row['option_text'],
        "correct" => $row['is_correct']
    ];
}


// --------------------------------------------------
// Build Moodle XML
// --------------------------------------------------
$xml = new SimpleXMLElement('<quiz/>');

foreach ($questions as $question) {

    $qnode = $xml->addChild('question');
    $qnode->addAttribute('type', 'multichoice');

    $name = $qnode->addChild('name');
    $parsed = $question['text'];

    if((strpos($parsed,"<")!=false && strpos($parsed,">")!= false) 
		|| (strpos($parsed,"<") != false &&  strpos($parsed,"/>") != false))
	{
		if(strpos($parsed,"<")!=false)
		{
            $parsed = str_replace("<","&lt",$parsed);
		}
		if(strpos($parsed,">") != false)
		{
            $parsed = str_replace(">","&gt",$parsed);
		}
		if(strpos($parsed,"/>") != false)
		{
            $parsed = str_replace("/>","/&gt",$parsed);
		}
	}

    $name->addChild('text', htmlspecialchars(substr($parsed,0,50)));

    $qtext = $qnode->addChild('questiontext');
    $qtext->addAttribute('format','html');
    $qtext->addChild('text', htmlspecialchars($question['text']));

    $qnode->addChild('single','true');
    $qnode->addChild('shuffleanswers','true');
    $qnode->addChild('answernumbering','abc');

    foreach ($question['options'] as $opt) {
        $fraction = $opt['correct'] ? "100" : "0";

        $ans = $qnode->addChild('answer');
        $ans->addAttribute('fraction', $fraction);
        $ans->addAttribute('format','html');
        $ans->addChild('text', htmlspecialchars($opt['text']));
    }
}


// --------------------------------------------------
// Output XML Download
// --------------------------------------------------
$filename = "quiz_" . $quiz_id . "_moodle.xml";

$dom = dom_import_simplexml($xml)->ownerDocument;
$dom->encoding = 'UTF-8';
$dom->formatOutput = true;

header("Content-Type: application/xml; charset=UTF-8");
header("Content-Disposition: attachment; filename=\"$filename\"");

echo $dom->saveXML();
exit;