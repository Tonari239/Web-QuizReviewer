<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
	echo json_encode([
		'loggedIn' => false
	]);
	exit;
}

echo json_encode([
	'loggedIn' => true,
	'username' => $_SESSION['username']
]);