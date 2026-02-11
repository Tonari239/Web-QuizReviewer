const navbar=document.querySelector("#navbar");

navbar.links = [
		{ text: 'Моите куизове', href: "../my-quizzes/my-quizzes.html" },
		{ text: 'Всички куизове', href: '../all-quizzes/all-quizzes.html' },
		{ text: 'Профил', href: '../landing/landing.html' },
	];

navbar.addEventListener("logout",()=>{
fetch("/test/index.php?logoutUser",{method:"POST"})
.then(()=>window.location="/test/client/landing/landing.html");
});

const urlParams=new URLSearchParams(window.location.search);
const quiz_id=urlParams.get("quiz_id") || 3;

fetch(`/../../server/reviews/get-quiz-questions.php?quiz_id=${quiz_id}`)
.then(res=>res.json())
.then(data=>{

document.querySelector("#quiz_id").value=data.quiz_id;

const container=document.querySelector("#questionsContainer");

data.questions.forEach(q=>{

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<h3>${q.question_text}</h3>

<div>
<strong>Трудност на въпроса:</strong>

<input type="hidden"
name="question_difficulty[${q.question_id}]"
value="0"
class="rating-input">

<span class="stars">
${Array.from({length:5},(_,i)=>
`<span class="star" data-value="${i+1}">&#9733;</span>`
).join("")}
</span>

</div>

<textarea
name="question_reviews[${q.question_id}]"
placeholder="Напиши рецензия за въпроса..."
></textarea>
`;

container.appendChild(card);

});

initStars();

});

function initStars(){

document.querySelectorAll(".stars").forEach(container=>{

const stars=container.querySelectorAll(".star");
const hiddenInput=container.parentElement.querySelector(".rating-input");

stars.forEach((star,index)=>{

star.addEventListener("mouseover",()=>{
stars.forEach((s,i)=>s.classList.toggle("hovered",i<=index));
});

star.addEventListener("mouseout",()=>{
stars.forEach(s=>s.classList.remove("hovered"));
});

star.addEventListener("click",()=>{
const value=star.dataset.value;
hiddenInput.value=value;

stars.forEach((s,i)=>s.classList.toggle("selected",i<value));
});

});

});

}