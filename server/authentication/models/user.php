<?php

class User
{
	private $email;
	private $username;
	private $password_hash;

	public function __construct($username, $email, $password)
	{
		if(isPasswordValid($password)) {
			$this->password = $password;
		} else {
			throw new Exception("Invalid password format");
			// TODO: check how to handle//stop construction
		}

		$this->username = $username;
		$this->email = $email;
		$this->password_hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
	}

	public function getPasswordHash()
	{
		return $this->password_hash;
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

	private function isPasswordValid($password)
	{
		return !empty($password) 
		&& $this->isBetweenLength($password, 6, 10)
		&& preg_match('/[A-Z]/', $password) && preg_match('/[a-z]/', $password) && preg_match('/[0-9]/', $password);
	}

	private function isBetweenLength($str, $min, $max)
	{
		$len = strlen($str);
		return $len >= $min && $len <= $max;
	}
}
?>
