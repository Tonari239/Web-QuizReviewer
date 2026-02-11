document.addEventListener("DOMContentLoaded",()=>{

const navbar=document.querySelector("#navbar");

const url=new URLSearchParams(window.location.search);

const quiz_id=url.get("quiz_id");
const user=url.get("user");

navbar.links=[
{ text:"Home", href:"/test/client/landing/landing.html"},
{ text:"Quizzes", href:"/test/client/quizzes/quizzes.html"},
{ text:"Logout", href:"#logout"}
];

navbar.addEventListener("logout",()=>{
fetch("/test/index.php?logoutUser",{method:"POST"})
.then(()=>window.location="/test/client/landing/landing.html");
});

const createStarDisplay = (rating) => {
  const filledStars = "★".repeat(rating);
  const emptyStars = `<span style="color:#ccc;">${"☆".repeat(5 - rating)}</span>`;
  return filledStars + emptyStars;
};

fetch(`/test/server/reviews/get-full-review.php?quiz_id=${quiz_id}&user=${user}`)
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
<h3><strong>Average difficulty: </strong> <span class="star">${avgStars}</span> (${avg.toFixed(1)}/5)</h3>
<h3>${q.question_text}</h3>
<h3>Review text: </h3>
<p class="review-text-box">${q.user_review.review_text || "No review"}</p>
`;

container.appendChild(card);

});

const backButton=document.createElement("button");
backButton.textContent="Back to Reviews";
backButton.onclick=()=>window.location=`reviews-list.html?quiz_id=${quiz_id}`;
container.appendChild(backButton);

})
.catch(err=>{
console.error("Error fetching review:",err);
document.querySelector("#fullReviewContainer").innerHTML="<p>Error loading review. Please try again.</p>";
});

}); 