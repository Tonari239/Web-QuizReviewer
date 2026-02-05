<?php
require_once __DIR__ . '/../../common_models/IDbSerializable.php';
class UserAuthenticationError implements JsonSerializable
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
		return [
			'message' => $this->message
		];
	}
}
?>