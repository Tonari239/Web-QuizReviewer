import { Router } from '../common/reused-scripts/router.js';
import { QuizTable } from '../common/reused-components/quiz-table/quiz-table.js';
import { ButtonCreatorCallback } from '../common/reused-scripts/button-creator-callback.js';

const router = new Router();

const deleteButton = new ButtonCreatorCallback("Изтрий", (quizId) => {
	fetch(router.getDataApiEndpoint() + "/deleteQuiz/", new URLSearchParams({quizId: quizId}).toString());
}, "../../Image_resources/Icons/trash-can.png");

const exportToXMLButton = new ButtonCreatorCallback("Експортирай",  (quizId) => {
	fetch(router.getDataApiEndpoint() + "/exportQuiz/", new URLSearchParams({quizId: quizId}).toString());
}, "../../Image_resources/Icons/xml-file-format-symbol.png");

const viewReviewsButton = new ButtonCreatorCallback("Прегледай рецензии", (quizId) => {
	router.redirectTo("kuvto e url-a za recenzii");
}, "../../Image_resources/Icons/eye.png");

const createButton = document.querySelector('#create-button');
createButton.addEventListener('click', () => {
	router.redirectTo("kuvto e url-a za създаване на quiz");
});

const quizPreviews = await fetch(router.getMyQuizPreviews())
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
	const buttonsCreatorFunctions = [deleteButton, exportToXMLButton, viewReviewsButton];
	const myQuizzesTable = new QuizTable(quizPreviews, buttonsCreatorFunctions);
	const container = document.getElementById('quiz-container');
	container.appendChild(myQuizzesTable);
	noQuizzesIndicator.style.visibility = 'hidden';
}


