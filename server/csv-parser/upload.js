function printQuestions(questions) {
        const output = document.getElementById('output');
        output.innerHTML = '';

        questions.forEach((row, index) => {
            const div = document.createElement('div');
            div.style.marginBottom = '1rem';

            div.innerHTML = `
                <strong>Question ${index + 1}</strong><br>
                A) ${row.answers[0]}<br>
                B) ${row.answers[1]}<br>
                C) ${row.answers[2]}<br>
                D) ${row.answers[3]}<br>
                Correct: ${row.correct} | Points: ${row.points}
            `;

            output.appendChild(div);
        });
    }


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('csvForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a CSV file');
            return;
        }

        const formData = new FormData();
        formData.append('csv', file);

        const response = await fetch('./get-question.php', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data);
        printQuestions(data.questions);
    });

    
});

