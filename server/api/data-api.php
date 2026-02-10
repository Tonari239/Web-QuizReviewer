<?php

require_once __DIR__ . '/../database/database-manager.php';
require_once __DIR__ . './models/quiz-preview.php';

header('Content-Type: application/json');
class DataApi 
{
	private $dbManager;
	public function __construct() 
	{
		$this->dbManager = new DatabaseManager();
	}

	public function getMyQuizPreviews()
	{
		session_start();

		$nonParsedQuizzesArray = $this->dbManager->selectFieldsWhere("quizzes", ["quiz_id", "quiz_name"], ["creator_user_guid"], [$_SESSION['user_guid']]);
		$quizPreviews = [];
		foreach ($nonParsedQuizzesArray as $quiz) {
			$quizPreviews[] = new QuizPreview($quiz['quiz_id'], $quiz['quiz_name']);
		}

		echo json_encode($quizPreviews);
	}

	public function getAllQuizPreviews()
	{
		session_start();

		$nonParsedQuizzesArray = $this->dbManager->selectFieldsWhere("quizzes", ["quiz_id", "quiz_name"], [], []);
		$quizPreviews = [];
		foreach ($nonParsedQuizzesArray as $quiz) {
			$quizPreviews[] = new QuizPreview($quiz['quiz_id'], $quiz['quiz_name']);
		}

		echo json_encode($quizPreviews);
	}

	public function deleteQuiz($quizId)
	{
		session_start();

		//TODO: Add check to see if quiz belongs to user before deleting
		//TODO: Wrap in try-catch; on fail return error, on success re-render the table
		$this->dbManager->deleteWhere("quizzes", ["quiz_id"], [$quizId]);
	}
}

?>