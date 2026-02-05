document.addEventListener('DOMContentLoaded', () => {
	const header = document.getElementById('landingHeader');
    const navbar = document.querySelector('quiz-navbar');
	const username = ''
    //Add logic to retrieve username

	if (username) {
		//Logged in
		header.textContent = `Здравей, ${username} :)`;
        navbar.links = [
			{ text: 'Профил', href: '#' },
			{ text: 'Изход', href: '#', onclick: logout }
		];
	} else {
		//Not logged in
        navbar.links = [
			{ text: 'Влизане', href: '../login-form/login-form.html' },
			{ text: 'Регистрация', href: '../registration-form/registration-form.html' }
		];
		header.textContent = 'Здравей :)';
	}
});

function logout() {
	//Add actual logout
	window.location.reload();
}