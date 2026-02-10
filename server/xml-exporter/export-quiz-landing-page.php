<?php
session_start();
$_SESSION['user_guid'] = "550e8400-e29b-41d4-a716-446655440000"; // for testing purposes only, in production this should be set at login and be unique per user
require "db.php";

$user_guid = $_SESSION['user_guid'] ; // must exist

$stmt = $pdo->prepare("
    SELECT quiz_id, quiz_name
    FROM quizzes
    WHERE creator_user_guid = ?
");
$stmt->execute([$user_guid]);
$quizzes = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html>
<head>
    <title>My Quizzes</title>
</head>
<body>

<h2>My Uploaded Quizzes</h2>

<?php if (!$quizzes): ?>
    <p>No quizzes found.</p>
<?php else: ?>

<form method="POST" action="export-moodle-xml.php">
    <select name="quiz_id" required>
        <?php foreach ($quizzes as $quiz): ?>
            <option value="<?= $quiz['quiz_id'] ?>">
                <?= htmlspecialchars($quiz['quiz_name']) ?>
            </option>
        <?php endforeach; ?>
    </select>

    <button type="submit">Export to Moodle XML</button>
</form>

<?php endif; ?>

</body>
</html>