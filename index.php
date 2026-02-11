<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

require_once __DIR__ . '/server/authentication/authentication-controller.php';
require_once __DIR__ . '/server/api/data-api.php';

class Application
{
	private $authController;
	private $dataApi;

	public function __construct() {
		$this->authController = new AuthenticationController();
		$this->dataApi = new DataApi();
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
		}
		elseif (isset($_GET['logoutUser'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use POST."]);
				return;
			}
			echo $this->authController->logoutUser();
		}
		elseif (isset($_GET['getMyQuizPreviews'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use GET."]);
				return;
			}
			echo $this->dataApi->getMyQuizPreviews();
		}
		elseif (isset($_GET['getAllQuizPreviews'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use GET."]);
				return;
			}
			echo $this->dataApi->getAllQuizPreviews();
		}
		elseif (isset($_GET['deleteQuiz'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use POST."]);
				return;
			}
			echo $this->dataApi->deleteQuiz($_GET['quizId']);
		}
		elseif (isset($_GET['homePage'])) {
			if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
				http_response_code(405);
				echo json_encode(["error" => "Method not allowed. Use GET."]);
				return;
			}
			header('Content-Type: text/html');
			header('Location: ./client/landing/landing.html');
		}
		 else {
			header('Content-Type: text/html');
			header('Location: ./client/landing/landing.html');
			exit();
		}
	}
}

// Instantiate and run the application
new Application();
?>