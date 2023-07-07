<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';
$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if (isset($_POST['game_id'])) {
  $game_id = $_POST['game_id'];
} else {
  echo json_encode("Error: Missing game_id");
  exit();
}

// info: Find game info
try{
  $sql = "SELECT * FROM results
          WHERE game_id = :game_id
          LIMIT 1";
  $s = $pdo->prepare($sql);
  $s->bindValue(':game_id', $game_id);  
  $s->execute();
}catch (PDOException $e) {
 echo $e->getMessage();
 exit();
}
$game_count = 0;
while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
  $result_date = $row['game_id'];
  $home_team = $row['home_team'];
  $away_team = $row['away_team'];
  $season = $row['season'];
}
if($game_count == 0) die();

// info: Find previous home team's game
try{
  $sql = "SELECT * FROM results
          WHERE (home_team = :home_team OR away_team = :home_team)
          AND result_date < :result_date
          AND season = :season
          ORDER BY result_date DESC
          LIMIT 1";
 $s = $pdo->prepare($sql);
 $s->bindValue(':result_date', $result_date);  
 $s->bindValue(':home_team', $home_team);  
  $s->bindValue(':season', $season);
 $s->execute();
} catch (PDOException $e) {
 echo $e->getMessage();
 exit();
}
$home_count = 0;
while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
  $prev_home_game_ids = [$row['game_id'], $home_team];
  $home_count++;
}
if($home_count == 0) $prev_home_game_ids = ['NONE', $home_team];

// info: Find previous away team's game
try{
  $sql = "SELECT * FROM results
          WHERE (home_team = :away_team OR away_team = :away_team)
          AND result_date < :result_date
          AND season = :season
          ORDER BY result_date DESC
          LIMIT 1";
  $s = $pdo->prepare($sql);
  $s->bindValue(':result_date', $result_date);  
  $s->bindValue(':away_team', $away_team);  
  $s->bindValue(':season', $season);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}
$away_count = 0;
while(($row = $s->fetch(PDO::FETCH_ASSOC)) != false){
  $prev_away_game_ids = [$row['game_id'], $away_team];
  $away_count++;
}
if($away_count == 0) $prev_away_game_ids = ['NONE', $away_team];

// info: package and return data
$prev_game_ids = array(
  'home' => $prev_home_game_ids[0], 
  'away' => $prev_away_game_ids[0]
);
echo json_encode($prev_game_ids);