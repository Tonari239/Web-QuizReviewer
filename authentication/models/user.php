<?php
require_once __DIR__ . '/../../common_models/IDbSerializable.php';

class User implements IDbSerializable
{
	private $guid;
	private $email;
	private $username;
	private $password;

	public function __construct($username, $email, $password, $guid)
	{
		$this->username = $username;
		$this->email = $email;
		$this->password = $password;

		if($guid)
		{
			$this->guid = $guid;
		}
		else
		{
			$this->guid = $this->generateGuid();
		}
	}

	public function toKeyValuePairs()
	{
		return [
			'user_guid' => $this->guid,
			'username' => $this->username,
			'email' => $this->email,
			'password_hash' => $this->getPasswordHash()
		];
	}

	public function getPassword()
	{
		return $this->password;
	}

	public function getPasswordHash()
	{
		return password_hash($this->password, PASSWORD_BCRYPT, ['cost' => 12]);
	}

	public function getUsername()
	{
		return $this->username;
	}

	public function getEmail()
	{
		return $this->email;
	}

	public function isUserValidForLogin()
	{
		return $this->isEmailValid()
		&& $this->isPasswordValid();
	}

	public function isUserValidForRegister()
	{
		return $this->isEmailValid()
		&& $this->isUsernameValid()
		&& $this->isPasswordValid();
	}

	private function isEmailValid()
	{
		return !empty($this->email) 
		&& filter_var($this->email, FILTER_VALIDATE_EMAIL);
	}

	private function isUsernameValid()
	{
		return !empty($this->username) 
		&& $this->isBetweenLength($this->username, 3, 10);
	}

	private function isPasswordValid()
	{
		return !empty($this->password) 
		&& $this->isBetweenLength($this->password, 6, 10)
		&& preg_match('/[A-Z]/', $this->password) && preg_match('/[a-z]/', $this->password) && preg_match('/[0-9]/', $this->password);
	}

	private function isBetweenLength($str, $min, $max)
	{
		$len = strlen($str);
		return $len >= $min && $len <= $max;
	}

	//from https://stackoverflow.com/questions/18206851/com-create-guid-function-got-error-on-server-side-but-works-fine-in-local-usin
	private function generateGuid()
	{
		 if (function_exists('com_create_guid')){
        return com_create_guid();
    }
    else {
        #mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        mt_srand((int)microtime()*10000);//ebe se s double
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = chr(123)// "{"
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
            .chr(125);// "}"
        return $uuid;
    }
	}
}
?>
