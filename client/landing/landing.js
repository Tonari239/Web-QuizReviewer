document.addEventListener('DOMContentLoaded', () => {
	const header = document.getElementById('landingHeader');
    const navbar = document.querySelector('quiz-navbar');
	const username = localStorage.getItem('username');
    //Add logic to retrieve username

	if (username) {
		//Logged in
		header.textContent = `Здравей, ${username} :)`;
        navbar.links = [
			{ text: 'Профил', href: '#' },
			{ text: 'Изход', href: '#logout' }
		];
	} else {
		//Not logged in
        navbar.links = [
			{ text: 'Влизане', href: '../login-form/login-form.html' },
			{ text: 'Регистрация', href: '../registration-form/registration-form.html' }
		];
		header.textContent = 'Здравей :)';
	}

	navbar.addEventListener('logout', () => {
		localStorage.removeItem('username');
		window.location.reload();
	});

});

