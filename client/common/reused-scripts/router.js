
let appConfig = null;

async function loadAppConfig() {
    if (!appConfig) {
		const response = await fetch("/client/clientConfig.json");
		if (!response.ok) {
			throw new Error("Failed to load clientConfig.json");
		}
		appConfig = await response.json();
    }
    return appConfig;
}

export class Router {
	constructor(baseUrl) {
		this._baseUrl = baseUrl;
	}

	static async create() {
		const config = await loadAppConfig();
		const baseUrl = config.serverUrl || 'http://localhost/index.php';
		return new Router(baseUrl);
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

	redirectTo(url) 
	{
		window.location.replace(url);
	}

}