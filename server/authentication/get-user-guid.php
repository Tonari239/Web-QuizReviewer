<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/auth-utils.php';

try {
	$guid = getAuthenticatedUserGuid();
	echo json_encode(['guid' => $guid]);
} catch (Exception $e) {
	http_response_code(401);
	echo json_encode(['error' => $e->getMessage()]);
}