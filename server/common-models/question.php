<?php

/*TODO: This DTO should be refactored, since its properties do not match the database structure.
We also need to decide whether we want to do the mapping to
the dependent entities in the backend, or in the frontend, so we can decide whether to model it
with the foreign keys here, or directly with the dependent entities, which would in turn map themselves
to their dependent entities.
*/
class Question 
{
    public int $id;
    public string $text;
    public array $answers;
    public string $correct;
    public int $points;
};

?>