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
		await registerUser().then(async (response) =>
		{
			const responseData = await response.json();
			if(response.status !== 200)
			{
				showErrorMessage(responseData.message);
			}
			else
			{
				showSuccessMessage(responseData.message);
				router.redirectTo("../login-form/login-form.html");
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

function showErrorMessage(errorMsg)
{
	let formMessageLabel = document.getElementById("formSentResultDisplay");
	const errorMessage = errorMsg || "Грешка при регистриране!";
	formMessageLabel.innerText = errorMessage;
	formMessageLabel.className = "error";
	formMessageLabel.style.display = "inline-block";
}

function showSuccessMessage(successMsg)
{
	let formMessageLabel = document.getElementById("formSentResultDisplay");
	const successMessage = successMsg || "Успешно регистриране!";
	formMessageLabel.innerText = successMessage;
	formMessageLabel.className = "success";
	formMessageLabel.style.display = "inline-block";
}

async function registerUser()
{
	const registerEndpoint = router.getRegisterEndpoint();

	return fetch(registerEndpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(convertUserRegisterDataFormInputToJson())
	});
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