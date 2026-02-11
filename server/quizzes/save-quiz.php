<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/QuizRepository.php';
require_once __DIR__ . '/../authentication/auth-utils.php';

if (!isset($_SESSION['username'])) {
	http_response_code(401);
	echo json_encode(['error' => 'Unauthorized']);
	exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['quizName'], $input['questions'])) {
	http_response_code(400);
	echo json_encode(['error' => 'Invalid payload']);
	exit;
}

$repo = new QuizRepository();

try {
    $userGuid = getAuthenticatedUserGuid();
	$quizId = $repo->createQuiz(
		$input['quizName'],
		$userGuid,
		$input['questions']
	);

	echo json_encode([
		'success' => true,
		'quizId' => $quizId
	]);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['error' => $e->getMessage()]);
}