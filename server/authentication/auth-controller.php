<?php
require_once __DIR__ . '/models/user.php';
require_once __DIR__ . '/models/userError.php';
require_once __DIR__ . '/../database/databaseManager.php';

class AuthenticationController
{
    private $dbManager;

    public function __construct() {
        $this->dbManager = new DatabaseManager();
    }

    public function registerUser()
    {
        //TODO: check if this file_get_contents is even the correct way to get the input data; what is the true option?
        $data = json_decode(file_get_contents('php://input'), true);
        $user = null; 
        try {
           $user = new User($data['username'], $data['email'], $data['password']);
        } catch (Exception $e) {
            http_response_code(400);
            return json_encode(new UserError("Invalid password"));
        }
        
        if(!$user->isUserValidForRegister()) {
            http_response_code(400);
            return json_encode(new UserError("Invalid user data for registration"));
        }

        if($this->userAlreadyExists($user)) {
            http_response_code(409);
            return json_encode(new UserError("User already exists"));
        }

        $this->dbManager->insertIntoTable('users', $user->toArray());
        http_response_code(200);
    }

    public function loginUser()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $user = null; 
        try {
           $user = new User($data['username'], $data['email'], $data['password']);
        } catch (Exception $e) {
            http_response_code(400);
            return json_encode(new UserError("Invalid password"));
        }

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
        }
        else
        {
            http_response_code(401);
            return json_encode(new UserError("Invalid password"));
        }

    }

    private function userAlreadyExists($user) {
       $result = $this->dbManager->findWhere('users',['username'], [$user->getUsername()]);
       return ($result != null);
    }

    private function verifyUserPassword($user) {
        $userToVerifyAgainst = $this->dbManager->findWhere('users',['email'],[$user->getEmail()]);
        return password_verify($user->getPasswordHash(), $userToVerifyAgainst['password_hash']);
    }
}
?>
