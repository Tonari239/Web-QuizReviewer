export class QuizTable extends HTMLElement {
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
		this._addTableRows(tableRoot);
		this._attachStyle();

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

			nameData.textContent = quiz.name;
			this._addOperations(operationsData, quiz);

			row.appendChild(nameData);
			row.appendChild(operationsData);
			
			tableRoot.appendChild(row);
		});
	}

	_addOperations(operationsData, quiz)
	{
		this._buttonsCreatorFunctions.forEach(buttonCreator => {
			const button = document.createElement('button');

			const buttonIcon = document.createElement('img');
			buttonIcon.src = buttonCreator._buttonLogo;
			button.appendChild(buttonIcon);

			const buttonText = document.createElement('span');
			buttonText.textContent = buttonCreator._buttonText;
			button.appendChild(buttonText);

			button.addEventListener('click', () => buttonCreator._onClickHandler(quiz.id));
			operationsData.appendChild(button);

			operationsData.classList.add('operations-cell');
			operationsData.style.gap = '0.5em';
		})
	}
	
	_attachStyle()
	{
		const style = document.createElement('style');
		style.textContent = `
			#quiz-table {
				width: 50em;
				border: 1px solid #420420;
				border-collapse: collapse;
				margin: 0 auto;
			}

			#quiz-table th,
			#quiz-table td {
				padding: 0.5em;
				text-align: left;
			}

			#quiz-table th:first-child,
			#quiz-table td:first-child {
				border-right: 1px solid #420420;
			}

			#quiz-table th:last-child {
				text-align: center;
			}

			tr
			{
				border: 1px solid #420420;
			}

			th
			{
				color: #FFF4F8;
				font-family: 'Inter', sans-serif;
			}

			.operations-cell {
				display: flex;
				justify-content: center;
			}

			#quiz-table th {
				background-color: #420420;
				font-weight: bold;
			}

			td {
				color: #420420;
			}

			button {
			    color: #420420;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.3em;
				padding: 0.5em;
				background: none;
				border: none;
				cursor: pointer;
				transition: opacity 0.3s ease;
			}

			button:hover {
				opacity: 0.7;
			}

			button img {
				width: 24px;
				height: 24px;
				object-fit: contain;
			}

			button span {
				font-size: 0.8em;
				text-align: center;
			}
		`;

		this.shadow.appendChild(style);
	}
}

customElements.define('quiz-table', QuizTable);