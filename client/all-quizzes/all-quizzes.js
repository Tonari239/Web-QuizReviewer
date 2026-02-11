import { Router } from '../common/reused-scripts/router.js';
import { QuizTable } from '../common/reused-components/quiz-table/quiz-table.js';
import { ButtonCreatorCallback } from '../common/reused-scripts/button-creator-callback.js';

const router = new Router();

const fillButton = new ButtonCreatorCallback("Попълни", (quizId) => {
	//TODO: redirect to quiz filling page
}, "../../Image_resources/Icons/paper.png");


const reviewButton = new ButtonCreatorCallback("Рецензирай", (quizId) => {
	//TODO: redirect to quiz grading page
}, "../../Image_resources/Icons/grade.png");

const quizPreviews = await fetch(router.getAllQuizPreviews())
.then(response => { 
	var res = response.json(); 
	return res;
}).catch(error => {return [];});

const noQuizzesIndicator = document.getElementById('no-quizzes-indicator');
if(quizPreviews.length === 0)
{
	noQuizzesIndicator.style.visibility = 'visible';
}
else
{
	const buttonsCreatorFunctions = [fillButton, reviewButton];
	const myQuizzesTable = new QuizTable(quizPreviews, buttonsCreatorFunctions);
	const container = document.getElementById('quiz-container');
	container.appendChild(myQuizzesTable);
	noQuizzesIndicator.style.visibility = 'hidden';
}


