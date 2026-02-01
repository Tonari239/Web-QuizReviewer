function isStringBetweenLengths(text, min, max)
{
	return text.length >= min && text.length <= max;
}

function showErrorOnElement(isValid, errorElementId)
{
	const errorElement = document.getElementById(errorElementId);
	if(!isValid)
	{
		errorElement.style.display = "block"; 
	}
	else if(isValid && errorElement.checkVisibility())
	{
		errorElement.style.display = "none";
	}
}

function isUsernameValid(username)
{
	return isStringBetweenLengths(username, 3, 15);
}

function validateUsername()
{
	const usernameInput = document.getElementById('username');
	const usernameValue = usernameInput.value;
	
	const isValid = isUsernameValid(usernameValue);
	showErrorOnElement(isValid, 'username-error');
	
	return isValid;
}

function validateEmail()
{
	const emailInput = document.getElementById('email');
	const emailValue = emailInput.value;

	// Source - https://stackoverflow.com/a
	// Posted by John Rutherford, modified by community. See post 'Timeline' for change history
	// Retrieved 2025-12-14, License - CC BY-SA 4.0
	const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

	const isValid = regex.test(emailValue);
	showErrorOnElement(isValid, 'email-error');
	
	return isValid;
}

function isPasswordValid(password)
{
	// Source - https://stackoverflow.com/a
	// Posted by Nina Scholz, modified by community. See post 'Timeline' for change history
	// Retrieved 2025-12-14, License - CC BY-SA 4.0
	return isStringBetweenLengths(password, 6, 10) && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}

function validatePassword()
{
	const passwordInput = document.getElementById('password');
	const passwordValue = passwordInput.value;

	const isValid = isPasswordValid(passwordValue);
	showErrorOnElement(isValid, 'password-error');	

	return isValid;
}

const validators = [
	validateUsername,
	validateEmail,
	validatePassword,
];

function validateFormOnSend()
{
	let errorsCount = 0;

	for(const validator of validators)
	{
		errorsCount += validator() ? 0 : 1;
	}

	const validFormLabel = document.getElementById('success');
	const formIsValid = errorsCount === 0;
	if (formIsValid)
	{
		const userAlreadyExistsLabel = document.getElementById('user-already-exists');
		requestData()
			.then(data => {
				if(!userAlreadyExists(data))
				{	
					userAlreadyExistsLabel.style.display = "none";
					return sendUserInfo(convertFormInputToJson())
						.then(() => {
							validFormLabel.style.display = "inline";
						});
				}
				else {
					validFormLabel.style.display = "none";
					userAlreadyExistsLabel.style.display = "inline";
				}
			})
			.catch(error => {
				console.error("Error:", error);
				validFormLabel.style.display = "none";
			});
	}
	else 
	{
		validFormLabel.style.display = "none";
	}
}

function userAlreadyExists(data)
{
	const usernameInput = document.getElementById('username');
	const usernameValue = usernameInput.value;

	for(const user of data)
	{
		if (usernameValue == user.username)
		{
			return true;
		}
	}
	return false;
}

function requestData()
{
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "https://jsonplaceholder.typicode.com/users");
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(JSON.parse(xhr.responseText));
			} else {
				reject(new Error(`HTTP Error: ${xhr.status}`));
			}
		};
		xhr.onerror = () => reject(new Error("Network error"));
		xhr.send();
	});
}

function convertFormInputToJson()
{
	return {
		name: document.getElementById('name').value + " " + document.getElementById('family-name').value,
		uesrname: document.getElementById('username').value,
		email: document.getElementById('email').value,
		address: {
			street: document.getElementById('street').value,
			city: document.getElementById('city').value,
			zipcode: document.getElementById('postalCode').value
		}
	}
}

function sendUserInfo(requestBody)
{
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("POST", "https://jsonplaceholder.typicode.com/users");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(JSON.parse(xhr.responseText));
			} else {
				reject(new Error(`HTTP Error: ${xhr.status}`));
			}
		};
		xhr.onerror = () => reject(new Error("Network error"));
		xhr.send(JSON.stringify(requestBody));
	});
}