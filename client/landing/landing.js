import { Router } from '../common/reused-scripts/router.js';

var router = new Router();

document.addEventListener('DOMContentLoaded', async () => {
	const header = document.getElementById('landingHeader');
    const navbar = document.querySelector('quiz-navbar');
    //Add logic to retrieve username

	
	try{
		const response = await fetch('../../server/authentication/me.php', {
			credentials: 'include' 
		});
		const data = await response.json();
		if (data.loggedIn) {
		//Logged in
		header.textContent = `Здравей, ${data.username} :)`;
        navbar.links = [
			{ text: 'Моите куизове', href: "../my-quizzes/my-quizzes.html" },
			{ text: 'Всички куизове', href: '../all-quizzes/all-quizzes.html' },
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

		navbar.addEventListener('logout',async () => {
			await fetch(router.getLogoutEndpoint(), { method: 'POST' });
			window.location.reload();
		});
	}
	catch (err) {
		console.error('Session check failed', err);
	}
	
});

