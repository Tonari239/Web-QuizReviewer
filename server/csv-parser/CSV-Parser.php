<?php

require_once __DIR__ . '/../common-models/question.php';
require_once __DIR__ .'/CSV-Validator.php';
class CSVParser
{  
    public static function extract(string $filePath): array
    {

        if (!file_exists($filePath)) 
        {
			throw new Exception("CSV file not found");
		}

        $questions = [];
        $handle = fopen($filePath, "r");
        
        
        $isValid = CSVValidator::validate($filePath);
        if($isValid['valid'] == false)
        {
            //print the error message to the user 
            //the message is in isValid['message']
            return [];
        }

        while (($row = fgetcsv($handle)) !== FALSE) 
        {
            $q = new Question();
            $q->text = $row[0];
            $q->answers = array_slice($row,1,4);
            $q->correct = $row[5];
            $q->points = (int)$row[6];
            $questions[] = $q;
        }
        fclose($handle);
        return $questions;
    }
    
}

