<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';
$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

// Check if the required data is present
if (isset($_POST['table_name'], $_POST['headers'])) {
    $tableName = $_POST['table_name'];
    $headers = $_POST['headers'];

    try{
        // Construct the CREATE TABLE query
        $query = "CREATE TABLE `betting`.`$tableName` (";

        // Add column definitions to the query
        foreach ($headers as $header) {
            $columnName = $header;
            $query .= "`$columnName` VARCHAR(300), ";
        }

        // Remove the trailing comma and space
        $query = rtrim($query, ', ');

        // Close the CREATE TABLE query
        $query .= ") ENGINE = MyISAM;";

        // Execute the CREATE TABLE query
        $pdo->exec($query);
    }catch (PDOException $e) {
        // Error occurred during table creation
        echo json_encode($insertQuery);
    }

    if(isset( $_POST['rows'])){
        $rows = $_POST['rows'];
    
        try {
            // Prepare the INSERT query
        $insertQuery = "INSERT INTO `$tableName` VALUES (";

        // Add placeholders for values
        $insertQuery .= implode(', ', array_fill(0, count($headers), '?'));

        $insertQuery .= ")";

        // Prepare the statement
        $statement = $pdo->prepare($insertQuery);

        // Insert rows into the newly created table
        foreach ($rows as $row) {
            // Bind the values to the placeholders
            for ($i = 0; $i < count($row); $i++) {
                $statement->bindValue($i + 1, $row[$i]);
            }
            // Execute the statement for each row
            $statement->execute();
        }
        } catch (PDOException $e) {
            // Error occurred during table creation
            echo json_encode($insertQuery);
        }
    } 
} else {
    // Required data not present in the POST request
    echo "Incomplete data. Please provide table_name, headers, and rows.";
}
