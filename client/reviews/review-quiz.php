<?php
session_start();
require "../../server/xml-exporter/db.php";

ini_set('display_errors',1);
error_reporting(E_ALL);

if(!isset($_SESSION['user_guid'])){
$_SESSION['user_guid']='550e8400-e29b-41d4-a716-446655440001';
}

if (!isset($_GET['quiz_id'])) {
$_GET['quiz_id'] = 1;
}

$quiz_id = (int)$_GET['quiz_id'];

$stmt = $pdo->prepare("
SELECT question_id, question_text
FROM questions
WHERE quiz_id = ?
");
$stmt->execute([$quiz_id]);
$questions = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html>
<head>
<title>Review Quiz</title>

<script src="../common/reused-components/nav-bar/navbar.js"></script>

<style>
body{
background:#FFF4F8;
font-family:Arial;
margin:0;
padding-top:4rem;
}

.container{
width:80%;
margin:auto;
padding:20px;
}

.card{
background:#420420;
padding:12px;
margin-bottom:15px;
border-radius:10px;
color:white;
font-size:14px;
}

textarea{
width:100%;
padding:8px;
margin-top:8px;
border-radius:8px;
border:none;
}

.submit{
background:#420420;
color:white;
padding:15px;
border:none;
border-radius:10px;
font-size:16px;
cursor:pointer;
}

.star{
font-size:22px;
cursor:pointer;
color:#888;
transition:0.2s;
}

.star:hover,
.star.hovered,
.star.selected{
color:gold;
text-shadow:0 0 8px gold;
}
</style>
</head>

<body>

<quiz-navbar id="navbar" active="Review"></quiz-navbar>

<div class="container">

<form method="POST" action="../../server/reviews/submit-review.php">

<input type="hidden" name="quiz_id" value="<?= $quiz_id ?>">

<?php foreach($questions as $q): ?>

<div class="card">

<h3><?= htmlspecialchars($q['question_text']) ?></h3>

<div>
<strong>Question difficulty:</strong>

<input type="hidden"
name="question_difficulty[<?= $q['question_id']?>]"
value="0"
class="rating-input">

<span class="stars">
<?php for($i=1;$i<=5;$i++): ?>
<span class="star" data-value="<?= $i ?>">★</span>
<?php endfor; ?>
</span>

</div>

<textarea
name="question_reviews[<?= $q['question_id']?>]"
placeholder="Write your review for this question..."
></textarea>

</div>

<?php endforeach; ?>

<div class="card">
<h3>General Quiz Review</h3>

<textarea
name="general_review"
placeholder="Write overall review..."
></textarea>
</div>

<!-- QUIZ RATING -->
<div class="card">

<strong>Quiz rating:</strong>

<input type="hidden"
name="quiz_rating"
value="0"
class="rating-input">

<span class="stars">
<?php for($i=1;$i<=5;$i++): ?>
<span class="star" data-value="<?= $i ?>">★</span>
<?php endfor; ?>
</span>

</div>

<button class="submit">Submit Review</button>

</form>

</div>

<script>
// universal star handler
document.querySelectorAll(".stars").forEach(container=>{

const stars = container.querySelectorAll(".star");
const hiddenInput = container.parentElement.querySelector(".rating-input");

stars.forEach((star,index)=>{

star.addEventListener("mouseover",()=>{
stars.forEach((s,i)=>s.classList.toggle("hovered",i<=index));
});

star.addEventListener("mouseout",()=>{
stars.forEach(s=>s.classList.remove("hovered"));
});

star.addEventListener("click",()=>{
const value = star.dataset.value;
hiddenInput.value = value;

stars.forEach((s,i)=>s.classList.toggle("selected",i<value));
});

});

});
</script>

<script>
const navbar=document.querySelector("#navbar");

navbar.links=[
{ text:"Home", href:"/test/client/landing/landing.html"},
{ text:"Quizzes", href:"/test/client/quizzes/quizzes.html"},
{ text:"Logout", href:"#logout"}
];

navbar.addEventListener("logout",()=>{
fetch("/test/index.php?logoutUser",{method:"POST"})
.then(()=>{
window.location="/test/client/landing/landing.html";
});
});
</script>

</body>
</html>