import { validateUsername, validateEmail, validatePassword } from '../common/reused-scripts/form-validators.js';
import { Router } from '../common/reused-scripts/router.js';

const validators = [
	validateUsername,
	validateEmail,
	validatePassword,
];

const router = await Router.create();
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
		await registerUser().then((response) =>
		{
			showSuccessMessage(response.message);
			window.location.replace(router.getLoginEndpoint());
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

function showErrorMessage(errorMsg)
{
	let formMessageLabel = document.getElementById("formSentResultDisplay");
	const errorMessage = errorMsg || "Грешка при влизане!";
	formMessageLabel.innerText = errorMessage;
	formMessageLabel.className = "error";
}

function showSuccessMessage(successMsg)
{
	let formMessageLabel = document.getElementById("formSentResultDisplay");
	const successMessage = successMsg || "Успешно влизане!";
	formMessageLabel.innerText = successMessage;
	formMessageLabel.className = "success";
}

async function registerUser()
{
	const registerEndpoint = router.getRegisterEndpoint();

	const response = await fetch(registerEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(convertUserRegisterDataFormInputToJson())
	});

	const text = await response.text();
	
	if (!text || text.trim() === '') {
		if (!response.ok) {
			throw new Error("Server returned empty response with status: " + response.status);
		}
		return { message: "Success" };
	}

	const data = JSON.parse(text);
	
	if (!response.ok) {
		throw new Error(data.errorMessage || "Failed to register user");
	}
	
	return data;
}

function convertUserRegisterDataFormInputToJson()
{
	return {
		username: document.getElementById('username').value,
		email: document.getElementById('email').value,
		password: document.getElementById('password').value,
	}
}

document.getElementById("register-btn").onclick = async() => {
  await sendForm();
};