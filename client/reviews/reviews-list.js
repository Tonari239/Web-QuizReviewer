document.addEventListener("DOMContentLoaded",()=>{

const navbar=document.querySelector("#navbar");

navbar.links = [
		{ text: 'Моите куизове', href: "../my-quizzes/my-quizzes.html" },
		{ text: 'Всички куизове', href: '../all-quizzes/all-quizzes.html' },
		{ text: 'Профил', href: '../landing/landing.html' },
	];

const urlParams=new URLSearchParams(window.location.search);
const quiz_id = urlParams.get("quiz_id") || 3;

fetch(`/../../server/reviews/get-quiz-reviews.php?quiz_id=${quiz_id}`)
.then(res=>res.json())
.then(data=>{

const container=document.querySelector("#reviewsContainer");
const avgBox=document.querySelector("#averageRatingBox");

let total=0;
let count=0;



data.reviews.forEach(r=>{
if(r.rating){
total+=Number(r.rating);
count++;
}
});

if (count==0)
{
  avgBox.innerHTML='<strong>Нямаш рецензии все още!</strong>';
  return;
}

const avg = count ? (total/count) : 0;
const avgRounded = Math.round(avg);

const createStarDisplay = (rating) => {
  const filledStars = "★".repeat(rating);
  const emptyStars = `<span style="color:#ccc;">${"☆".repeat(5 - rating)}</span>`;
  return filledStars + emptyStars;
};

let stars = createStarDisplay(avgRounded);
avgBox.innerHTML=`
<strong>Средна оценка от рецензии:</strong>
${avg.toFixed(1)}/5
<span class="star">${stars}</span>
`;

data.reviews.forEach(r=>{
stars=createStarDisplay(r.rating || 0);

const row=document.createElement("div");
row.className="review-row";

row.innerHTML=`

<div class="card review-content">
<h3>Рецензия от ${r.username}</h3>

<div>
<h3><strong>Оценка на теста:</strong> <span class="star">${stars}</span></h3>
</div>
<h3>Рецензия: </h3>
<p class="review-text-box">${r.review_text || "No text review"}</p>
</div>

<div class="review-actions">
<button onclick="window.location='full-review.html?quiz_id=${quiz_id}&user=${r.reviewer_user_guid}'">
Виж пълната рецензия
</button>
</div>
`;

container.appendChild(row);

});

});

});