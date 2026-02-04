<?php
session_start();

//TODO: Replace with real data retrieval logic
// This file is created by me so I can remember how to check if the user is authenticated by 
// checking for the user guid in the session
if (!isset($_SESSION['guid'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized: Please log in.']);
    exit();
}

// User is authenticated, return dummy data
header('Content-Type: application/json');
echo json_encode([
    'question' => 'This is a protected dummy question.'
]);
