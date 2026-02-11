document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector("#navbar");

    navbar.links = [
        { text: "Home", href: "/test/client/landing/landing.html" },
        { text: "Quizzes", href: "/test/client/quizzes/quizzes.html" },
        { text: "Logout", href: "#logout" }
    ];

    navbar.addEventListener("logout", () => {
        fetch("/test/index.php?logoutUser", { method: "POST" })
            .then(() => window.location = "/test/client/landing/landing.html");
    });

    const urlParams = new URLSearchParams(window.location.search);
    const attempt_id = urlParams.get("attempt_id");

    if (!attempt_id) {
        document.querySelector("#resultsContainer").innerHTML = "<p style='color:red;'>Error: No attempt ID provided. Use ?attempt_id=1 or ?attempt_id=2 to test.</p>";
        return;
    }

    fetch(`/test/server/reviews/get-quiz-results.php?attempt_id=${attempt_id}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {

            if (!data.questions || data.questions.length === 0) {
                document.querySelector("#resultsContainer").innerHTML = "<p style='color:red;'>No questions found for this attempt.</p>";
                return;
            }

            const container = document.querySelector("#resultsContainer");

            let correctCount = 0;

            data.questions.forEach((q, index) => {

                const isCorrect = q.user_selected_option_id === q.correct_option_id;
                if (isCorrect) correctCount++;

                const card = document.createElement("div");
                card.className = "question-card";

                const answerClass = isCorrect ? "correct-answer" : "incorrect-answer";
                const answerLabel = isCorrect ? "✓ You answered: " : "✗ You answered: ";

                card.innerHTML = `
<h3>Question ${index + 1}</h3>
<p>${q.question_text}</p>

<div class="answer-section">
<p class="${answerClass}">${answerLabel}${q.user_selected_option_text}</p>
<p class="correct-answer">Correct answer: ${q.correct_option_text}</p>
</div>
`;

                container.appendChild(card);

            });

            const resultsSummary = document.createElement("div");
            resultsSummary.className = "results-summary";
            resultsSummary.innerHTML = `Results: ${correctCount} out of ${data.questions.length}`;
            container.appendChild(resultsSummary);

            const backButton = document.createElement("button");
            backButton.textContent = "Back to Quizzes";
            backButton.onclick = () => window.location = "../all-quizzes/all-quizzes.html";
            container.appendChild(backButton);

        })
        .catch(err => {
            console.error("Error fetching results:", err);
            document.querySelector("#resultsContainer").innerHTML = `<p style='color:red;'>Error loading results: ${err.message}</p><p>Make sure the attempt_id is valid. Try ?attempt_id=1 or ?attempt_id=2</p>`;
        });

});
