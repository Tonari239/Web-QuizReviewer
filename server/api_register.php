<?php
// api/register.php - Example endpoint for registration

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    // Example: Validate and process registration data
    if (!empty($data['username']) && !empty($data['password'])) {
        // Here you would add database logic
        echo json_encode(['success' => true, 'message' => 'Registration successful!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing username or password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
