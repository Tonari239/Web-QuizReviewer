<?php
class DatabaseConfig()
{
	private $DB_HOST;
	private $DB_NAME;
	private $DB_USER;
	private $DB_PASS;

	public function __construct() {
		$configPath = __DIR__ . '/config.ini';
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
}
?>