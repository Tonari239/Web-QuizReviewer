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
		style.textContent = ``;

		this.shadow.appendChild(style);
	}
}

customElements.define('quiz-table', QuizTable);