import { validateEmail, validatePassword } from '../common/reused-scripts/form-validators.js';
import { Router } from '../common/reused-scripts/router.js';

const router = await Router.create();

const validators = [
	validateEmail,
	validatePassword,
];

async function sendForm()
{
	let errorsCount = 0;

	for(const validator of validators)
	{
		errorsCount += validator() ? 0 : 1;
	}

	const formIsValid = errorsCount === 0;
	if (formIsValid)
	{
		await loginUser().then(async (response) =>
		{
			const responseData = await response.json();
			if(response.status !== 200)
			{
				showErrorMessage(responseData.message);
			}
			else
			{
				localStorage.setItem("username", responseData.username);
				showSuccessMessage(responseData.message);
				router.redirectTo(router.getHomePageUrl());
			}
		}).catch((error) => 
		{
			console.error("Error:", error);
			showErrorMessage(error.message);
		})
	}
	else 
	{
		showErrorMessage("Моля, коригирайте грешките във формата.");
	}
}

async function loginUser()
{
	const loginEndpoint = router.getLoginEndpoint();

	return fetch(loginEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(convertUserLoginDataFormInputToJson())
	}).then(response => {
		if (!response.ok) {
			throw new Error(response.message);
		}
		else
		{
			return response.json();
		}
	})
}

function convertUserLoginDataFormInputToJson()
{
	return {
		email: document.getElementById('email').value,
		password: document.getElementById('password').value,
	}
}

function showErrorMessage(errorMsg)
{
	let formMessageLabel = document.getElementById("formSentResultDisplay");
	const errorMessage = errorMsg || "Грешка при влизане!";
	formMessageLabel.innerText = errorMessage;
	formMessageLabel.className = "error";
	formMessageLabel.style.display = "inline-block";
}

function showSuccessMessage(successMsg)
{
	let formMessageLabel = document.getElementById("formSentResultDisplay");
	const successMessage = successMsg || "Успешно влизане!";
	formMessageLabel.innerText = successMessage;
	formMessageLabel.className = "success";
	formMessageLabel.style.display = "inline-block";
}

document.getElementById("login-btn").onclick = async () => {
  await sendForm();
};