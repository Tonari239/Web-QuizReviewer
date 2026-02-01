export function validateUsername()
{
	const usernameInput = document.getElementById('username');
	const usernameValue = usernameInput.value;
	
	const isValid = isUsernameValid(usernameValue);
	showErrorOnElement(isValid, 'username-error');
	
	return isValid;
}

export function validateEmail()
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

export function validatePassword()
{
	const passwordInput = document.getElementById('password');
	const passwordValue = passwordInput.value;

	const isValid = isPasswordValid(passwordValue);
	showErrorOnElement(isValid, 'password-error');	

	return isValid;
}

function isStringBetweenLengths(text, min, max)
{
	return text.length >= min && text.length <= max;
}

function isUsernameValid(username)
{
	return isStringBetweenLengths(username, 3, 15);
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

function isPasswordValid(password)
{
	// Source - https://stackoverflow.com/a
	// Posted by Nina Scholz, modified by community. See post 'Timeline' for change history
	// Retrieved 2025-12-14, License - CC BY-SA 4.0
	return isStringBetweenLengths(password, 6, 10) && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
}