<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';
$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if (isset($_POST['table_name'], $_POST['old_header'], $_POST['new_header'])) {
  $tableName = $_POST['table_name'];
  $old_header = $_POST['old_header'];
  $new_header = $_POST['new_header'];

  try {
    $renameQuery = "ALTER TABLE `$tableName` RENAME COLUMN `$old_header` TO `$new_header`";
    $statement = $pdo->prepare($renameQuery);
    $statement->execute();
  } catch (PDOException $e) {
    echo json_encode($renameQuery);
  }
} else {
  echo json_encode("Error: Missing table_name, old_header or new_header");
  exit();
}