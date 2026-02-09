import { Router } from '../common/reused-scripts/router.js';
import { QuizTable } from '../common/reused-components/quiz-table/quiz-table.js';
import { QuizPreview } from '../common/models/quiz-preview.js';
import { ButtonCreatorCallback } from '../common/reused-scripts/button-creator-callback.js';

const router = new Router();

const deleteButton = new ButtonCreatorCallback("Изтрий", (quizId) => {
	fetch(router.getDataApiEndpoint() + "/deleteQuiz/", new URLSearchParams({quizId: quizId}).toString());
}, "../../Image_resources/Icons/trash-can.png");

const exportToXMLButton = new ButtonCreatorCallback("Експортирай",  (quizId) => {
	fetch(router.getDataApiEndpoint() + "/exportQuiz/", new URLSearchParams({quizId: quizId}).toString());
}, "../../Image_resources/Icons/xml-file-format-symbol.png");

const viewReviewsButton = new ButtonCreatorCallback("Прегледай рецензий", (quizId) => {
	router.redirectTo("kuvto e url-a za recenzii");
}, "../../Image_resources/Icons/eye.png");

const quizPreviews = [
	new QuizPreview(1, "Quiz 1"),
	new QuizPreview(2, "Quiz 2"),
	new QuizPreview(3, "Quiz 3")
];

const buttonsCreatorFunctions = [deleteButton, exportToXMLButton, viewReviewsButton];
const myQuizzesTable = new QuizTable(quizPreviews, buttonsCreatorFunctions);

// Add the table to the DOM
const container = document.getElementById('quiz-container');
container.appendChild(myQuizzesTable);
