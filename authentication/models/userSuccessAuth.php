<?php
class UserSuccessAuth implements JsonSerializable
{
	private $message;

	public function __construct($message)
	{
		$this->message = $message;
	}

	public function getMessage()
	{
		return $this->message;
	}

	public function jsonSerialize()
	{
		$username = "";
		if(isset($_SESSION) && isset($_SESSION['username'])) {
			$username = $_SESSION['username'];
		}
		return [
			'username' => $_SESSION['username'],
			'message' => $this->message
		];
	}
}
?>