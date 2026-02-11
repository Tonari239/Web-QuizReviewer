import { Router } from '../common/reused-scripts/router.js';
import { QuizTable } from '../common/reused-components/quiz-table/quiz-table.js';
import { ButtonCreatorCallback } from '../common/reused-scripts/button-creator-callback.js';

const router = new Router();



const createButton = document.querySelector('#create-button');
createButton.addEventListener('click', () => {
	router.redirectTo("../create-quiz/create-quiz.html");
});

const quizPreviews = await fetch(router.getMyQuizPreviews())
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
	const deleteButton = new ButtonCreatorCallback("Изтрий", async(quizId) => {
		var deleteResponse = await fetch(router.getDeleteQuizEndpoint(quizId), { method: "POST" }).then(response => response.json());
		if(deleteResponse.successfulDelete)
		{
			allQuizPreviews = allQuizPreviews.filter(q => q.id !== quizId);
			myQuizzesTable.quizPreviewList = allQuizPreviews;
		}
		else
		{
			alert(deleteResponse.error);
		}
	}, "../../Image_resources/Icons/trash-can.png");

	const exportToXMLButton = new ButtonCreatorCallback("Експортирай",  (quizId) => {

		const form = document.createElement("form");
		form.method = "POST";
		form.action = "/test/server/xml-exporter/export-moodle-xml.php";

		const input = document.createElement("input");
		input.type = "hidden";
		input.name = "quiz_id";
		input.value = quizId;

		form.appendChild(input);
		document.body.appendChild(form);

		form.submit();
	}, "../../Image_resources/Icons/xml-file-format-symbol.png");

	const viewReviewsButton = new ButtonCreatorCallback("Прегледай рецензии", (quizId) => {
		router.redirectTo("../reviews/reviews-list.html?quiz_id=" + quizId);
	}, "../../Image_resources/Icons/eye.png");

	const buttonsCreatorFunctions = [deleteButton, exportToXMLButton, viewReviewsButton];
	myQuizzesTable = new QuizTable(quizPreviews, buttonsCreatorFunctions);
	const container = document.getElementById('quiz-container');
	container.appendChild(myQuizzesTable);
	noQuizzesIndicator.style.visibility = 'hidden';
}

const searchInput = document.getElementById('search-my-quizzes');
let debounceTimer;

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


