export class Router {
	constructor() {
		this._baseUrl = 'https://localhost/';
	}

	getHomePageUrl() {
		return this._baseUrl + "?homePage";
	}
		
	getLoginEndpoint() {
		return this._baseUrl + "?loginUser";
	}

	getRegisterEndpoint() {
		return this._baseUrl + "?registerUser";
	}

	getLogoutEndpoint() {
		return this._baseUrl + "?logoutUser";
	}
	
	getDeleteQuizEndpoint(quizId)
	{
		return this._baseUrl + "?deleteQuiz&" + new URLSearchParams({quizId: quizId}).toString();
	}

	getMyQuizPreviews()
	{
		return this._baseUrl + "?getMyQuizPreviews";
	}

	getAllQuizPreviews()
	{
		return this._baseUrl + "?getAllQuizPreviews";
	}

	redirectTo(url) {
		window.location.replace(url);
	}

}