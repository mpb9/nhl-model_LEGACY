<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';
$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if (isset($_POST['table_name'])) {
    $tableName = $_POST['table_name'];
  try{
    $query = "DROP TABLE `betting`.`$tableName`;";
    $pdo->exec($query);
    echo json_encode("Table deleted successfully");
  } catch (PDOException $e) {
    echo json_encode($e);
  }
} else {
  echo json_encode("Error: Missing table_name");
}