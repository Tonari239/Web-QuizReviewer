import appConfig from "../../clientConfig.json" assert { type: "json" };

class Router
{
	constructor()
	{
		this._baseUrl = appConfig.serverUrl || 'http://localhost/Web-QuizReviewer/server/'
	}

	getLoginEndpoint()
	{
		return this._getAuthenticationControllerEndpoint()+"?loginUser";
	}

	getRegisterEndpoint()
	{
		return this._getAuthenticationControllerEndpoint()+"?registerUser";
	}

	_getAuthenticationControllerEndpoint()
	{
		return this._baseUrl + 'authentication/auth-controller.php';
	}
}