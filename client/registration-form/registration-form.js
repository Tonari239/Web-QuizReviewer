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
		await registerUser().then(() =>
		{
			const validFormLabel = document.getElementById('success');
			validFormLabel.style.display = "inline";
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

function showErrorMessage(errorMessage)
{
	const validFormLabel = document.getElementById('success');
	validFormLabel.style.display = "none";

	alert(errorMessage);
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