<?php
require_once __DIR__ . '/../database/database-manager.php';

header('Content-Type: application/json');
session_start();

if (!isset($_SESSION['username'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not logged in']);
    exit;
}

$username = $_SESSION['username'];

$pdo = (new DatabaseConfig())->getDbConnection();

$stmt = $pdo->prepare("SELECT user_guid FROM users WHERE username = ?");
$stmt->execute([$username]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$userGuid = $user['user_guid'];
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['quiz_id']) || !isset($data['answers'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$quizId = $data['quiz_id'];
$answers = $data['answers'];

try {
    $db = new DatabaseManager();

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT attempt_id FROM quiz_attempts 
        WHERE user_guid = ? AND quiz_id = ?
    ");
    $stmt->execute([$userGuid, $quizId]);

    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Вече си правил този тест!'
        ]);
        exit;
    }

    // Insert attempt
    $stmt = $pdo->prepare("
        INSERT INTO quiz_attempts (user_guid, quiz_id, score)
        VALUES (?, ?, ?)
    ");

    $stmt->execute([$userGuid, $quizId, 0]);
    $attemptId = $pdo->lastInsertId();

    // Insert individual answers
    foreach ($answers as $answer) {

        $stmt = $pdo->prepare("
            INSERT INTO user_answers (attempt_id, question_id, selected_option_id)
            VALUES (?, ?, ?)
        ");

        $stmt->execute([
            $attemptId,
            $answer['question_id'],
            $answer['option_id'],
        ]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true
    ]);

} catch (Exception $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($e->errorInfo[1] == 1062) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Вече си правил този тест!'
        ]);
        exit;
    }

    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
