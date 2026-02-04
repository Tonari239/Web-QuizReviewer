<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once __DIR__ . '/models/user.php';
require_once __DIR__ . '/models/userError.php';
require_once __DIR__ . '/models/userSuccessAuth.php';
require_once __DIR__ . '/../database/databaseManager.php';

class AuthenticationController
{
    private $dbManager;

    public function __construct() {
        $this->dbManager = new DatabaseManager();
    }

    public function registerUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $user = new User($data['username'], $data['email'], $data['password'], null);
        
        if(!$user->isUserValidForRegister()) {
            http_response_code(400);
            return json_encode(new UserError("Invalid user data for registration"));
        }

        if($this->userAlreadyExists($user)) {
            http_response_code(409);
            return json_encode(new UserError("User already exists"));
        }

        $this->dbManager->insertIntoTable('users', $user->toKeyValuePairs());
        http_response_code(200);
        return json_encode(new UserSuccessAuth("User registered successfully"));
    }

    public function loginUser()
    {
        session_start();

        $data = json_decode(file_get_contents('php://input'), true);
        $user = new User(null, $data['email'], $data['password'], null);

        if(!$user->isUserValidForLogin()) {
            http_response_code(400);
            return json_encode(new UserError("Invalid user data for login"));
        }

        if(!$this->userAlreadyExists($user)) {
            http_response_code(400);
            return json_encode(new UserError("User does not exist"));
        }

        if($this->verifyUserPassword($user)) {
            http_response_code(200);

            $userRecord = $this->dbManager->findWhere('users',['email'],[$user->getEmail()]);
            $_SESSION['username'] = $userRecord['username'];
            // Return username and guid for display only
            return json_encode(new UserSuccessAuth());
        }
        else
        {
            http_response_code(401);
            return json_encode(new UserError("Invalid password"));
        }

    }

    private function userAlreadyExists($user) {
       $result = $this->dbManager->findWhere('users',['email'], [$user->getEmail()]);
       return ($result != null);
    }

    private function verifyUserPassword($user) {
        $userToVerifyAgainst = $this->dbManager->findWhere('users',['email'],[$user->getEmail()]);
        return password_verify($user->getPassword(), $userToVerifyAgainst['password_hash']);
    }
}
