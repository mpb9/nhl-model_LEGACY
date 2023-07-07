<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';
$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if (isset($_POST['table_name'], $_POST['headers'], $_POST['rows'])) {
    $tableName = $_POST['table_name'];
    $headers = $_POST['headers'];
    $rows = $_POST['rows'];

    try {
      $insertQuery = "INSERT INTO `$tableName` VALUES (";
      $insertQuery .= implode(', ', array_fill(0, count($headers), '?'));
      $insertQuery .= ")";

      $statement = $pdo->prepare($insertQuery);

      foreach ($rows as $row) {
          for ($i = 0; $i < count($row); $i++) {
              $statement->bindValue($i + 1, $row[$i]);
          }
          $statement->execute();
      }

    } catch (PDOException $e) {
      echo json_encode($insertQuery);
    }
} else {
    echo json_encode("Error: Missing table_name, headers or rows");
    exit();
}