<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/models/user.php';
require_once __DIR__ . '/models/userAuthenticationError.php';
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
            return json_encode(new UserAuthenticationError("Невалидни потребителски данни за регистрация"), JSON_UNESCAPED_UNICODE);
        }

        if($this->userAlreadyExists($user)) {
            http_response_code(409);
            return json_encode(new UserAuthenticationError("Потребителят вече съществува"), JSON_UNESCAPED_UNICODE);
        }

        $this->dbManager->insertIntoTable('users', $user->toKeyValuePairs());
        http_response_code(200);
        return json_encode(new UserSuccessAuth("Потребителят е регистриран успешно"), JSON_UNESCAPED_UNICODE);
    }

    public function loginUser()
    {
        session_start();

        $data = json_decode(file_get_contents('php://input'), true);
        $user = new User(null, $data['email'], $data['password'], null);

        if(!$user->isUserValidForLogin()) {
            http_response_code(400);
            return json_encode(new UserAuthenticationError("Невалидни потребителски данни за вписване"), JSON_UNESCAPED_UNICODE);
        }

        if(!$this->userAlreadyExists($user)) {
            http_response_code(400);
            return json_encode(new UserAuthenticationError("Потребителят не съществува"), JSON_UNESCAPED_UNICODE);
        }

        if($this->verifyUserPassword($user)) {
            http_response_code(200);

            $userRecord = $this->dbManager->findWhere('users',['email'],[$user->getEmail()]);
            $_SESSION['username'] = $userRecord['username'];
            return json_encode(new UserSuccessAuth("Потребителят се вписа успешно"), JSON_UNESCAPED_UNICODE);
        }
        else
        {
            session_destroy();
            http_response_code(401);
            return json_encode(new UserAuthenticationError("Невалидна парола"), JSON_UNESCAPED_UNICODE);
        }

    }

    public function logoutUser()
    {
        session_start();
        session_destroy();
        http_response_code(200);
        return json_encode(new UserSuccessAuth("Потребителят се изписа успешно"), JSON_UNESCAPED_UNICODE);
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
