<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';

$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);


if(empty($_POST['startDate']) || empty($_POST['endDate'])) die();
$start_date = $_POST['startDate'];
$end_date = $_POST['endDate'];

try{
  $sql = "SELECT DISTINCT result_date FROM results 
  WHERE result_date <= :end_date 
  AND result_date >= :start_date";
  $s = $pdo->prepare($sql);
  $s->bindValue(':start_date', $start_date);
  $s->bindValue(':end_date', $end_date);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
  $dates[] = $row['result_date'];
}

echo json_encode($dates);