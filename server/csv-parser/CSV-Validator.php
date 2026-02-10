<?php

class CSVValidator
{
    private static $MIN_NUMBER_OF_COLS = 4;
    public static function error(string $message): array
    {
        return 
        [
            'valid' => false,
            'message' => $message
        ];
    }
    public static function validate(string $filePath): array
    {
        $handle = fopen($filePath, "r");
        $numberOfRows = 0;
        $numberOfColumns = 0;
        while (($row = fgetcsv($handle)) !== FALSE) 
        {
            $numberOfColumns += count($row);
            $numberOfRows++;

            if($numberOfColumns < self::$MIN_NUMBER_OF_COLS)
            {
                return self::error("Too few columns in csv file. Please ensure your file is in the format: question,at least 2 answers,Letter of correct answer,points given");
            }

            if($row[0]=="")
            {
                return self::error("Question text cannot be empty");
            }

            $correctAnswer = $row[count($row)-2];

            if(!preg_match('/^[A-Z]$/', $correctAnswer))
            {
                return self::error("Correct answer must be a single uppercase letter (A-Z)");
            }

            $maxLetter = chr(64 + (count($row) - 3)); // 'A' is 65 in ASCII

            if($correctAnswer > $maxLetter)
            {
                return self::error("Correct answer letter exceeds number of provided answers");
            }
        }
        
        if(fmod($numberOfColumns, $numberOfRows) != 0)
        {
            return self::error("Inconsistent number of columns across rows in the CSV file");
        }

        fclose($handle);

        return ['valid' => true];
    }
}