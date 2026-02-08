<?php
class DatabaseConfig
{
	private $DB_HOST;
	private $DB_NAME;
	private $DB_USER;
	private $DB_PASS;

	public function __construct() {
        $configPath = __DIR__ . '/../../../setup/database-configuration.ini';
        if (!file_exists($configPath)) {
            throw new Exception('Database config file not found');
        }
        $config = parse_ini_file($configPath);
        if (!$config || !isset($config['DB_HOST'], $config['DB_NAME'], $config['DB_USER'], $config['DB_PASS'])) {
            throw new Exception('Invalid database config');
        }

		$this->DB_HOST = $config['DB_HOST'];
		$this->DB_NAME = $config['DB_NAME'];
		$this->DB_USER = $config['DB_USER'];
		$this->DB_PASS = $config['DB_PASS'];
	}

	public function getDbConnection()
    {
        try {
            $dsn = "mysql:host={$this->DB_HOST};dbname={$this->DB_NAME};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, $this->DB_USER, $this->DB_PASS, $options);
            return $pdo;
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            throw new Exception("Database connection failed");
        }
    }
}
?>