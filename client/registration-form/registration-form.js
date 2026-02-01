import { validateUsername, validateEmail, validatePassword } from '../common/reused-scripts/form-validators.js';

const validators = [
	validateUsername,
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
	const registerEndpoint = "someString";

	await fetch(registerEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(convertUserRegisterDataFormInputToJson())
	}).then(response => {
		if (!response.ok) {
			throw new Error(response.message || "Failed to register user");
		}
		else
		{
			return response.json();
		}
	})
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