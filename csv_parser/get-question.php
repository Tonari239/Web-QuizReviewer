<?php

require_once __DIR__ . '/CSV_Parser.php';

header('Content-Type: application/json');

if (!isset($_FILES['csv'])) {
	http_response_code(400);
	echo json_encode(['error' => 'No file uploaded']);
	exit;
}

$file = $_FILES['csv'];

$uploadDir = __DIR__ . '/../uploads';
if (!is_dir($uploadDir)) {
	mkdir($uploadDir, 0777, true);
}

$tmpPath = $uploadDir . '/' . uniqid('exam_', true) . '.csv';

move_uploaded_file($file['tmp_name'], $tmpPath);

try {
	$questions = CSV_Parser::extract($tmpPath);
	unlink($tmpPath);

	echo json_encode([
		'success' => true,
		'questions' => $questions
	]);
} catch (Exception $e) {
	http_response_code(500);
	echo json_encode(['error' => $e->getMessage()]);
}

