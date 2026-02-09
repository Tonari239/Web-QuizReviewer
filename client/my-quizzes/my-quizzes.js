const router = new Router();

const deleteButton = new ButtonCreatorCallback("Изтрий", (quizId) => {
	router.getDataApiEndpoint() + "/deleteQuiz/" + quizId
}, "../../Image_resources/Icons/trash-can.png");

const exportToXMLButton = new ButtonCreatorCallback("Експортирай",  () => {
	router.getDataApiEndpoint() + "/exportQuiz/" + quizId
}, "../../Image_resources/Icons/xml-file-format-symbol.png");

const viewReviewsButton = new ButtonCreatorCallback("Прегледай рецензий", () => {
	router.redirectTo("kuvto e url-a za recenzii") + quizId;
}, "../../Image_resources/Icons/eye.png");

const quizPreviews = [
	new QuizPreview(1, "Quiz 1"),
	new QuizPreview(2, "Quiz 2"),
	new QuizPreview(3, "Quiz 3")
];

const buttonsCreatorFunctions = [deleteButton, exportToXMLButton, viewReviewsButton];
const myQuizzesTable = new QuizTable(quizPreviews, buttonsCreatorFunctions);
