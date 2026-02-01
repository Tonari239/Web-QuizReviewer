class NavBar extends HTMLElement {
	constructor() {
		super();
		
		// Attach shadow DOM
		const shadow = this.attachShadow({ mode: 'open' });
		
		// Create the navbar structure
		const nav = document.createElement('nav');
		nav.classList.add('navbar');
		
		// Create brand/logo link
		const brandLink = document.createElement('a');
		brandLink.textContent = 'Quizzer';
		brandLink.href = '#';
		
		// Create links container
		const linksContainer = document.createElement('div');
		linksContainer.classList.add('navbar-links');
		
		// Create login link
		const loginLink = document.createElement('a');
		loginLink.textContent = 'Влизане';
		loginLink.href = '#';
		
		// Create register link
		const registerLink = document.createElement('a');
		registerLink.textContent = 'Регистрация';
		registerLink.href = '#';
		
		// Append links to container
		linksContainer.appendChild(loginLink);
		linksContainer.appendChild(registerLink);
		
		// Append elements to nav
		nav.appendChild(brandLink);
		nav.appendChild(linksContainer);
		
		const style = document.createElement('style');
		style.textContent = `
			.navbar {
				width: 100vw;
				margin: 0;
				padding: 0.5em 2em;
				border: none;
				box-sizing: border-box;
				position: fixed;
				top: 0;
				left: 0;
				right: 0;
				z-index: 100;
				display: flex;
				height: 3.5rem;
				justify-content: space-between;
				align-items: center;
				background: #420420;
				backdrop-filter: blur(10px);
			}

			.navbar a {
				color: #FFF4F8;
				text-decoration: none;
				font-size: 1.1em;
				margin-left: 1.5em;
				margin-right: 0;
				cursor: pointer;
			}
			
			.navbar a:first-child {
				margin-left: 0;
				margin-right: auto;
				font-weight: bold;
				font-size: 1.3em;
			}

			.navbar-links {
				display: flex;
				align-items: center;
				gap: 1.5em;
			}

			.navbar a:last-child {
				margin-right: 0;
			}
		`;
		
		shadow.appendChild(style);
		shadow.appendChild(nav);
	}
}

customElements.define('quiz-navbar', NavBar);