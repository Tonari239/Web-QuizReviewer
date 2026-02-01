<?php
// Enable CORS for frontend communication
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit();
}

require_once __DIR__ . '/authentication/auth-controller.php';

class Application
{
	private $authController;

	public function __construct() {
		$this->authController = new AuthenticationController();
		$this->route();
	}

	private function route()
	{
		// Use query parameters for routing (simple approach)
		if (isset($_GET['registerUser'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use POST."]);
				return;
			}
			echo $this->authController->registerUser();
		} elseif (isset($_GET['loginUser'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use POST."]);
				return;
			}
			echo $this->authController->loginUser();
		} else {
			http_response_code(404);
			echo json_encode(["error" => "Endpoint not found"]);
		}
	}
}

// Instantiate and run the application
new Application();
?>