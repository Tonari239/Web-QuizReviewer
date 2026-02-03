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
		return [
			'message' => $this->message
		];
	}
}
?>