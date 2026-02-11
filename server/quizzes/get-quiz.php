<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../database/database-manager.php';

if (!isset($_GET['id'])) {
	http_response_code(400);
	echo json_encode(['error' => 'Missing quiz id']);
	exit;
}

$quiz_id = (int)$_GET['id'];

$db = new DatabaseManager();

try {
	// 1. Get quiz
	$quiz = $db->findWhere('quizzes', ['quiz_id'], [$quiz_id]);

	if (!$quiz) {
		http_response_code(404);
		echo json_encode(['error' => 'Quiz not found']);
		exit;
	}

	// 2. Get questions
	$pdo = (new DatabaseConfig())->getDbConnection();
	$stmt = $pdo->prepare("SELECT * FROM questions WHERE quiz_id = ?");
	$stmt->execute([$quiz_id]);
	$questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

	foreach ($questions as &$question) {
		$stmt = $pdo->prepare("SELECT option_id, option_text FROM question_options WHERE question_id = ?");
		$stmt->execute([$question['question_id']]);
		$question['options'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	echo json_encode([
		'quiz' => $quiz,
		'questions' => $questions
	]);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['error' => $e->getMessage()]);
}
