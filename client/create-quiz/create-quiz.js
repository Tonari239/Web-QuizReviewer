import { Router } from '../common/reused-scripts/router.js';

var router = new Router();
var isUploaded = false;
const header = document.getElementById('createHeader');
let previewQuestions = [];
let previewQuizName = '';

document.addEventListener('DOMContentLoaded', async () => {

    const navbar = document.querySelector('quiz-navbar');
    const username = localStorage.getItem('username');

    try {
        const response = await fetch('../../server/authentication/me.php', {
            credentials: 'include'
        });
        const data = await response.json();
        if (data.loggedIn) {
            //Logged in

            header.textContent = `Качи .csv файл, за да започнеш :)`;
            navbar.links = [
                { text: 'Моите куизове', href: "../my-quizzes/my-quizzes.html" },
                { text: 'Всички куизове', href: '../all-quizzes/all-quizzes.html' },
                { text: 'Профил', href: '../landing/landing.html' },
            ];
        } else {
            //Not logged in

            navbar.links = [
                { text: 'Влизане', href: '../login-form/login-form.html' },
                { text: 'Регистрация', href: '../registration-form/registration-form.html' }
            ];
            const fileInput = document.getElementById('csvForm');
            fileInput.style.display = 'none';

            header.textContent = 'Влез в профила си, за да правиш тестове :)';
        }

    } catch (err) {
        console.error('Session check failed', err);
    }

});

function printQuestions(questions) {
    const output = document.getElementById('output');
    const saveButton = document.getElementById('saveQuizBtn');
    saveButton.style.display = 'flex';
    output.style.display = 'flex';
    output.innerHTML = '';

    questions.forEach((row, index) => {
        const div = document.createElement('div');
        div.className = 'question';

        div.innerHTML = `
                <strong><u>Въпрос ${index + 1}: ${row.text}</u></strong><br>
                А) ${row.answers[0]}<br>
                Б) ${row.answers[1]}<br>
                В) ${row.answers[2]}<br>
                Г) ${row.answers[3]}<br>
                Отговор: ${row.correct}
            `;

        output.appendChild(div);
    });

}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('csvForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('csvFile');
        var filename = fileInput.files[0].name;
        filename = filename.split('.')[0];
        const file = fileInput.files[0];

        if (!file) {
            alert('Моля изберете .csv файл!');
            return;
        }

        const formData = new FormData();
        formData.append('csv', file);

        const response = await fetch('../../server/csv-parser/get-question.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        previewQuestions = data.questions;
        previewQuizName = filename;
        console.log(data);
        isUploaded = true;
        const finishHeader = document.getElementById('finishHeader');
        const quizHeader = document.getElementById('quizHeader');
        finishHeader.style.removeProperty('display');
        quizHeader.style.removeProperty('display');
        quizHeader.textContent = 'Име на теста: ' + filename;
        header.textContent = `Искаш да качиш друг файл?`;
        printQuestions(previewQuestions);
    });
});

document.getElementById('saveQuizBtn').addEventListener('click', async () => {
    if (!isUploaded || previewQuestions.length === 0) {
        alert('Няма качен тест за запазване');
        return;
    }

    const response = await fetch('../../server/quizzes/save-quiz.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            quizName: previewQuizName,
            questions: previewQuestions
        })
    });

    const result = await response.json();

    if (result.success) {
        alert('Тестът е запазен успешно!');
        router.redirectTo('../my-quizzes/my-quizzes.html');
    } else {
        alert(result.error || 'Грешка при записване');
    }
});



