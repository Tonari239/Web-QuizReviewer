<?php
require_once __DIR__ . '/../database/models/database-config.php';
$dbConfig = new DatabaseConfig();

$host = $dbConfig->DB_HOST;

$db   = $dbConfig->DB_NAME;
$user = $dbConfig->DB_USER;
$pass = $dbConfig->DB_PASS;
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die("DB Connection failed: " . $e->getMessage());
}