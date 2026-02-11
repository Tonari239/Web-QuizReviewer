import { Router } from '../common/reused-scripts/router.js';
import { QuizTable } from '../common/reused-components/quiz-table/quiz-table.js';
import { ButtonCreatorCallback } from '../common/reused-scripts/button-creator-callback.js';

const router = new Router();

const quizPreviews = await fetch(router.getAllQuizPreviews())
.then(response => { 
	var res = response.json(); 
	return res;
}).catch(error => {return [];});

const noQuizzesIndicator = document.getElementById('no-quizzes-indicator');

let myQuizzesTable = null;
let allQuizPreviews = quizPreviews;

if(quizPreviews.length === 0)
{
	noQuizzesIndicator.style.visibility = 'visible';
}
else
{
	const fillButton = new ButtonCreatorCallback("Попълни", (quizId) => {
		//TODO: redirect to quiz filling page
	}, "../../Image_resources/Icons/paper.png");


	const reviewButton = new ButtonCreatorCallback("Рецензирай", (quizId) => {
		//TODO: redirect to quiz grading page
	}, "../../Image_resources/Icons/grade.png");

	const buttonsCreatorFunctions = [fillButton, reviewButton];
	myQuizzesTable = new QuizTable(quizPreviews, buttonsCreatorFunctions);
	const container = document.getElementById('quiz-container');
	container.appendChild(myQuizzesTable);
	noQuizzesIndicator.style.visibility = 'hidden';
}

const searchInput = document.getElementById('search-my-quizzes');
let debounceTimer; // debounce is used for optimizing, in order not to search every milisecond but once the user stops typing

searchInput.addEventListener('input', (event) => {
	clearTimeout(debounceTimer);
	
	debounceTimer = setTimeout(() => {
		const searchTerm = event.target.value.toLowerCase();
		const filteredQuizzes = allQuizPreviews.filter(quiz => 
			quiz.name.toLowerCase().includes(searchTerm)
		);
		
		// Update table or show no quizzes indicator
		if (filteredQuizzes.length === 0) {
			if (myQuizzesTable) {
				myQuizzesTable.style.display = 'none';
			}
			noQuizzesIndicator.style.visibility = 'visible';
		} else {
			if (myQuizzesTable) {
				myQuizzesTable.quizPreviewList = filteredQuizzes;
				myQuizzesTable.style.display = 'block';
			}
			noQuizzesIndicator.style.visibility = 'hidden';
		}
	}, 400);
});
