document.addEventListener("DOMContentLoaded",()=>{

const navbar=document.querySelector("#navbar");

const url=new URLSearchParams(window.location.search);

const quiz_id=url.get("quiz_id");
const user=url.get("user");

navbar.links = [
		{ text: 'Моите куизове', href: "../my-quizzes/my-quizzes.html" },
		{ text: 'Всички куизове', href: '../all-quizzes/all-quizzes.html' },
		{ text: 'Профил', href: '../landing/landing.html' },
	];

const createStarDisplay = (rating) => {
  const filledStars = "★".repeat(rating);
  const emptyStars = `<span style="color:#ccc;">${"☆".repeat(5 - rating)}</span>`;
  return filledStars + emptyStars;
};

fetch(`/../../server/reviews/get-full-review.php?quiz_id=${quiz_id}&user=${user}`)
.then(res=>res.json())
.then(data=>{

const container=document.querySelector("#fullReviewContainer");

data.questions.forEach((q, index)=>{

if(!q.user_review) return;

let total=0;
let count=0;

q.all_reviews.forEach(r=>{
if(r.difficulty){
total+=Number(r.difficulty);
count++;
}
});

const avg = count ? (total/count) : 0;
const avgRounded = Math.round(avg);

const avgStars=createStarDisplay(avgRounded);

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<h3>Question ${index + 1}</h3>
<h3><strong>Средна трудност на въпросите: </strong> <span class="star">${avgStars}</span> (${avg.toFixed(1)}/5)</h3>
<h3>${q.question_text}</h3>
<h3>Рецензия: </h3>
<p class="review-text-box">${q.user_review.review_text || "Няма рецензия"}</p>
`;

container.appendChild(card);

});

const backButton=document.createElement("button");
backButton.textContent="Обратно към Рецезиите";
backButton.onclick=()=>window.location=`reviews-list.html?quiz_id=${quiz_id}`;
container.appendChild(backButton);

})
.catch(err=>{
console.error("Error fetching review:",err);
document.querySelector("#fullReviewContainer").innerHTML="<p>Error loading review. Please try again.</p>";
});

}); 