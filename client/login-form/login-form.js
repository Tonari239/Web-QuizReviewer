import { validateEmail, validatePassword } from '../common/reused-scripts/form-validators.js';

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
		await loginUser().then(() =>
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

async function loginUser()
{
	const loginEndpoint = "someString";

	await fetch(loginEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(convertUserLoginDataFormInputToJson())
	}).then(response => {
		if (!response.ok) {
			throw new Error(response.message || "Failed to login user");
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

function showErrorMessage(errorMessage)
{
	const validFormLabel = document.getElementById('success');
	validFormLabel.style.display = "none";

	alert(errorMessage);
}

document.getElementById("login-btn").onclick = async () => {
  await sendForm();
};