<?php
class DatabaseManager()
{
    private $config;
	public function __construct() {
		$this->config = new DatabaseConfig();
	}

    public function insertIntoTable($table, $data)
    {
        try {
            $pdo = $this->getDbConnection();
            $columns = implode(", ", array_keys($data));
            $placeholders = implode(", ", array_fill(0, count($data), "?"));
            $stmt = $pdo->prepare("INSERT INTO $table ($columns) VALUES ($placeholders)");
            $stmt->execute(array_values($data));
            return $pdo->lastInsertId();
        } catch (PDOException $e) {
            error_log("Database error in insertIntoTable: " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    public function findWhere($table, $columns, $values)
    {
        try {
            $pdo = $this->getDbConnection();
            $conditions = [];
            foreach ($columns as $column) {
                $conditions[] = "$column = ?";
            }
            $whereClause = implode(" AND ", $conditions);
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE $whereClause");
            $stmt->execute($values);
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Database error in findWhere: " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    private function getDbConnection()
    {
        try {
            $dsn = "mysql:host={$this->config->DB_HOST};dbname={$this->config->DB_NAME};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, $this->config->DB_USER, $this->config->DB_PASS, $options);
            return $pdo;
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
}
?>
