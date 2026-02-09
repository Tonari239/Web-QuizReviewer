<?php
class UserAuthenticationSuccess implements JsonSerializable
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

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		if(isset($_SESSION) && isset($_SESSION['username'])) {
			return [
			'username' => $_SESSION['username'],
			'message' => $this->message
		  ];
		}

		return [
			'message' => $this->message
		];
	}
}
?>