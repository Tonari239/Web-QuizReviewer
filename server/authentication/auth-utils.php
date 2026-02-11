<?php
require_once __DIR__ . '/../database/database-manager.php';

function getAuthenticatedUserGuid(): string
{
	if (!isset($_SESSION['username'])) {
		throw new Exception('Not authenticated');
	}

	$db = new DatabaseManager();
	$user = $db->findWhere(
		'users',
		['username'],
		[$_SESSION['username']]
	);

	if (!$user) {
		throw new Exception('User not found');
	}

	return $user['user_guid']; 
}