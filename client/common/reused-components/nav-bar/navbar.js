class NavBar extends HTMLElement {
	constructor() {
		super();
		
		this.shadow = this.attachShadow({ mode: 'open' });
		this._links = [];
	}
	
	static get observedAttributes() {
		return ['active'];
	}
	
	connectedCallback() {
		this._render();
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'active' && oldValue !== newValue) {
			this._render();
		}
	}
	
	set links(value) {
		this._links = value;
		this._render();
	}
	
	get links() {
		return this._links;
	}
	
	_render() {
		this.shadow.innerHTML = '';
		
		const navigationRoot = this._createNavigationElement();
		
		this._attachAppName(navigationRoot);
		this._attachLinks(navigationRoot);
		this._attachStyle();

		this.shadow.appendChild(navigationRoot);
	}

	_createNavigationElement()
	{
		const nav = document.createElement('nav');
		nav.id = 'navbar';
		return nav;
	}
	_attachStyle()
	{
		const style = document.createElement('style');
		style.textContent = `
			#navbar {
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

			#navbar a {
				color: #FFF4F8;
				text-decoration: none;
				font-size: 1.3em;
				margin-left: 1.5em;
				font-family: 'Inter', sans-serif;
				margin-right: 0;
				cursor: pointer;
				padding: 0.5em 1em;
				border-radius: 0.5em;
				transition: background-color 0.3s ease;
			}
			
			
			#navbar a.active {
				background-color: rgba(255, 244, 248, 0.2); 
				font-weight: bold;
			}
			
			#navbar a:first-child {
				margin-left: 0;
				margin-right: auto;
			}
			
			#navbar-links {
				display: flex;
				align-items: center;
				gap: 0.5em;
			}

			#navbar-links a {
				margin: 0;
			}
		`;

		this.shadow.appendChild(style);
	}

	_attachAppName(navigationRoot)
	{
		const appNameLink = document.createElement('a');
		appNameLink.textContent = 'Quizzer';
		appNameLink.href = '/';
		navigationRoot.appendChild(appNameLink);
	}

	_attachLinks(navigationRoot)
	{
		const linksContainer = document.createElement('div');
		linksContainer.classList.add('navbar-links');
		
		// Get active page from attribute
		const activePage = this.getAttribute('active');
		
		// Create navigation links from the links array
		this._links.forEach(link => {
			const anchor = document.createElement('a');
			anchor.textContent = link.text;
			anchor.href = link.href;
			
			// Add active class if this link matches the active attribute
			if (activePage && (link.href === activePage || link.text === activePage)) {
				anchor.classList.add('active');
			}

			
			//Logout logic
			if (link.href === '#logout') {
				anchor.addEventListener('click', (e) => {
					e.preventDefault();
					this.dispatchEvent(new CustomEvent('logout', {
						bubbles: true,
						composed: true 
					}));
				});
			}
			
			linksContainer.appendChild(anchor);
		});

		navigationRoot.appendChild(linksContainer);
	}	
}

customElements.define('quiz-navbar', NavBar);