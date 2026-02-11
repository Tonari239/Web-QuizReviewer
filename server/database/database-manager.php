<?php
require_once __DIR__ . '/models/database-config.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

class DatabaseManager
{
    private $config;

	public function __construct() {
		$this->config = new DatabaseConfig();
	}

    //Data is associative array that goes by column -> columnValue
    public function insertIntoTable($table, $data)
    {
        try {
            $pdo = $this->config->getDbConnection();
            $columns = implode(", ", array_keys($data));
            $placeholders = implode(", ", array_fill(0, count($data), "?"));
            $stmt = $pdo->prepare("INSERT INTO $table ($columns) VALUES ($placeholders)");
            $stmt->execute(array_values($data));
            return $pdo->lastInsertId();
        } catch (PDOException $e) {
            error_log("Database error in insertIntoTable: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    public function findWhere($table, $columns, $values)
    {
        try {
            $pdo = $this->config->getDbConnection();
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
            throw new Exception($e->getMessage());
        }
    }

    public function selectFieldsWhere($table, $selectFields, $whereColumns, $whereValues)
    {
        try {
            $pdo = $this->config->getDbConnection();
            $selectClause = implode(", ", $selectFields);
            $conditions = [];
            foreach ($whereColumns as $column) {
                $conditions[] = "$column = ?";
            }
            $whereClause = implode(" AND ", $conditions);
            if(count($whereValues) > 0) {
                $stmt = $pdo->prepare("SELECT $selectClause FROM $table WHERE $whereClause");
            }
            else
            {
                $stmt = $pdo->prepare("SELECT $selectClause FROM $table");
            }
            $stmt->execute($whereValues);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Database error in selectFieldsWhere: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }

    public function deleteWhere($table, $whereColumns, $whereValues)
    {
        try {
            $pdo = $this->config->getDbConnection();
            $conditions = [];
            foreach ($whereColumns as $column) {
                $conditions[] = "$column = ?";
            }
            $whereClause = implode(" AND ", $conditions);
            $stmt = $pdo->prepare("DELETE FROM $table WHERE $whereClause");
            $stmt->execute($whereValues);
        } catch (PDOException $e) {
            error_log("Database error in deleteWhere: " . $e->getMessage());
            throw new Exception($e->getMessage());
        }
    }
}
?>
