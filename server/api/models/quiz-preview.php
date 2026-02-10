<?php
class QuizPreview implements JsonSerializable
{
	private $id;
	private $name;

	public function __construct($id, $name)
	{
		$this->id = $id;
		$this->name = $name;
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{

		return [
			'id' => $this->id,
			'name' => $this->name
		];
	}
}

?>
