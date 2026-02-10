export class Router {
	constructor() {
		this._baseUrl = 'https://localhost/index.php';
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
	
	getDataApiEndpoint()
	{
		return this._baseUrl + "/api";
	}

	getQuizPreviewsEndpoint()
	{
		return this._baseUrl + "?getQuizPreviews";
	}

	redirectTo(url) {
		window.location.replace(url);
	}

}