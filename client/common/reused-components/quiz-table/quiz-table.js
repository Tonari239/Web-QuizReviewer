class QuizTable extends HTMLElement {
	constructor(quizPreviewList, buttonsCreatorFunctions) {
		super();
		
		this.shadow = this.attachShadow({ mode: 'open' });
		this._quizPreviewList = quizPreviewList;
		this._buttonsCreatorFunctions = buttonsCreatorFunctions;
		this._createTable();
	}
	
	_createTable() {
		this.shadow.innerHTML = '';
		
		const tableRoot = this._createTableElement();
		this._addTableHeaders(tableRoot);
		this._attachRows(tableRoot);
		//this._attachStyle();

		this.shadow.appendChild(tableRoot);
	}

	_createTableElement()
	{
		const table = document.createElement('table');
		table.id = 'quiz-table';
		return table;
	}

	_addTableHeaders(tableRoot)
	{
		const headerRow = document.createElement('tr');

		const nameHeader = document.createElement('th');
		nameHeader.textContent = 'Име на Quiz';

		const operationsHeader = document.createElement('th');
		operationsHeader.textContent = 'Операции';
		headerRow.appendChild(nameHeader);
		headerRow.appendChild(operationsHeader);

		tableRoot.appendChild(headerRow);
	}

	_addTableRows(tableRoot)
	{
		this._quizPreviewList.forEach(quiz => {
			const row = document.createElement('tr');

			const nameData = document.createElement('td');
			const operationsData = document.createElement('td');

			nameData.textContent = quiz._name;
			this._addOperations(operationsData);

			row.appendChild(nameData);
			row.appendChild(operationsData);
			
			tableRoot.appendChild(row);
		});
	}

	_addOperations(operationsData)
	{
		this._buttonsCreatorFunctions.forEach(buttonCreator => {
			const button = document.createElement('button');

			const buttonIcon = document.createElement('img');
			buttonIcon.src = buttonCreator._buttonLogo;
			button.appendChild(buttonIcon);

			button.innerHTML = buttonCreator._buttonText;
			button.addEventListener('click', buttonCreator._onClickHandler);
			operationsData.appendChild(button);

			operationsData.style.display = 'flex';
			operationsData.style.gap = '0.5em';
		})
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
}

customElements.define('quiz-table', QuizTable);