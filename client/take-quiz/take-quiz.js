document.addEventListener('DOMContentLoaded', async () => {

	const params = new URLSearchParams(window.location.search);
	const quizId = params.get('id');

	if (!quizId) {
		alert('Missing quiz id');
		return;
	}

	const response = await fetch(
		`../../server/quizzes/get-quiz.php?id=${quizId}`
	);

	const data = await response.json();

	if (data.error) {
		alert(data.error);
		return;
	}

	document.getElementById('quizTitle').textContent =
		data.quiz.Name;

	renderQuiz(data.questions);
});

function renderQuiz(questions) {

	const container = document.getElementById('quizContainer');
	container.innerHTML = '';

	questions.forEach((q, index) => {

		const div = document.createElement('div');
		div.className = 'question';
        div.dataset.questionId = q.question_id;
		div.innerHTML = `
			<h3>${index + 1}. ${q.question_text}</h3>
		`;

		q.options.forEach(option => {

			const label = document.createElement('label');
			label.className = 'answer-box';

			label.innerHTML = `
				<input type="radio" 
				       name="question-${q.question_id}" 
				       value="${option.option_id}">
				<span>${option.option_text}</span>
			`;

			div.appendChild(label);
		});

		container.appendChild(div);
	});
}

document.getElementById('submitQuiz').addEventListener('click', async () => {

    const quizId = new URLSearchParams(window.location.search).get('id');

    const questionGroups = document.querySelectorAll('[data-question-id]');
    const answers = [];

    let allAnswered = true;

    questionGroups.forEach(group => {
        const questionId = group.dataset.questionId;
        const selected = group.querySelector('input[type="radio"]:checked');

        if (!selected) {
            allAnswered = false;
            return;
        }

        answers.push({
            question_id: parseInt(questionId),
            option_id: parseInt(selected.value)
        });
    });

    if (!allAnswered) {
        alert('Моля изберете отговор на всеки въпрос!');
        return;
    }

    const response = await fetch('../../server/quizzes/submit-quiz.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            quiz_id: parseInt(quizId),
            answers: answers
        })
    });

    const result = await response.json();

    if (result.success) {
        alert(`Тестът е предаден успешно!`);
    } else {
        alert(result.error || 'Грешка при изпращане');
    }
});
