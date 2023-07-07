<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-condition: Content-Type");
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';
$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if (isset($_POST['table_name'], $_POST['condition'])) {
    $tableName = $_POST['table_name'];
    $condition = $_POST['condition'];
    try {
      $query = "DELETE FROM `betting`.`$tableName` WHERE $condition;";
      $pdo->exec($query);
      echo json_encode("Data deleted successfully");
    } catch (PDOException $e) {
      echo json_encode($e);
    }
} else {
    echo json_encode("Error: Missing table_name or condition");
    exit();
}