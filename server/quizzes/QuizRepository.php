<?php

require_once __DIR__ . '/../database/database-manager.php';

class QuizRepository
{
	private DatabaseManager $db;

	public function __construct()
	{
		$this->db = new DatabaseManager();
	}

	public function createQuiz(
		string $name,
		string $creatorGuid,
		array $questions
	): int {
        //Quiz Creation
		$quizId = $this->db->insertIntoTable('quizzes', [
			'creator_user_guid' => $creatorGuid,
			'quiz_name' => $name
		]);

        //Questions Creation
		foreach ($questions as $question) {
	        $questionId = $this->db->insertIntoTable('questions', [
		    'quiz_id' => $quizId,
		    'question_text' => $question['text']
	        ]);

            foreach ($question['answers'] as $index => $answerText) {
                $letter = chr(ord('A') + $index);

                $this->db->insertIntoTable('question_options', [
                'question_id ' => $questionId,
                'option_text' => $answerText,
                'is_correct' => ($letter === $question['correct'])
                ]);
            }
        }

		return $quizId;
	}
}