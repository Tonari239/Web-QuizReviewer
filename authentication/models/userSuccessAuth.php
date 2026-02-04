<?php
class UserSuccessAuth implements JsonSerializable
{
	private $message;

	public function __construct($message="User logged in successfully!")
	{
		$this->message = $message;
	}

	public function getMessage()
	{
		return $this->message;
	}

	public function jsonSerialize()
	{
		return [
			'username' => $_SESSION['username'],
			'message' => $this->message
		];
	}
}
?>