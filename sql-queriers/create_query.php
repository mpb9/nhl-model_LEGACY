<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/db.inc.php';
include $_SERVER['DOCUMENT_ROOT'] . '/bet-nhl/bet-nhl-APIs/includes/helpers.inc.php';

$restJson = file_get_contents("php://input");
$_POST = json_decode($restJson, true);

if(empty($_POST['query_id'])) die();
$new_query_index = $_POST['query_id'];

$table = $_POST['table'];
if(empty($table['name']) || empty($table['columns'])) die();
$table_name = $table['name'];
$columns = $table['columns'];

$website = $_POST['website'];
if(empty($website['baseUrl'])) die();
$base_url = $website['baseUrl'];
$extensions = [''];
if(!empty($website['extensions'])){
  $extensions = $website['extensions'];
}

$page_path = $_POST['pagePath'];
if(empty($page_path['toAllData']) || empty($page_path['toDataElement'])) die();
if(($page_path['toAllHeaders'] == 'NA' || $page_path['toHeaderElement'] == 'NA') && $page_path['numCols'] <= 0) die();

try{
  $sql = "INSERT INTO queries SET
          query_id = :query_id,
          table_name = :table_name,
          base_url = :base_url";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $new_query_index);
  $s->bindValue(':table_name', $table_name);
  $s->bindValue(':base_url', $base_url);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

for($i = 0; $i < count($columns); $i++){
  try{
    $sql = "INSERT INTO query_columns SET
            query_id = :query_id,
            col_id = :col_id,
            col_name = :col_name,
            col_type = :col_type";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $new_query_index);
    $s->bindValue(':col_id', $i);
    $s->bindValue(':col_name', $columns[$i]['name']);
    $s->bindValue(':col_type', $columns[$i]['type']);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
}

for($i = 0; $i < count($extensions); $i++){
  try{
    $sql = "INSERT INTO query_extensions SET
            query_id = :query_id,
            ext_id = :ext_id,
            ext = :ext";
    $s = $pdo->prepare($sql);
    $s->bindValue(':query_id', $new_query_index);
    $s->bindValue(':ext_id', $i);
    $s->bindValue(':ext', $extensions[$i]);
    $s->execute();
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit();
  }
}

try{
  $sql = "INSERT INTO query_page_paths SET
          query_id = :query_id,
          to_all_headers = :to_all_headers,
          to_header_element = :to_header_element,
          to_all_data = :to_all_data,
          to_data_element = :to_data_element,
          num_cols = :num_cols";
  $s = $pdo->prepare($sql);
  $s->bindValue(':query_id', $new_query_index);
  $s->bindValue(':to_all_headers', $page_path['toAllHeaders']);
  $s->bindValue(':to_header_element', $page_path['toHeaderElement']);
  $s->bindValue(':to_all_data', $page_path['toAllData']);
  $s->bindValue(':to_data_element', $page_path['toDataElement']);
  $s->bindValue(':num_cols', $page_path['numCols']);
  $s->execute();
} catch (PDOException $e) {
  echo $e->getMessage();
  exit();
}

if(!empty($page_path['customColumns'])){
  $custom_columns = $page_path['customColumns'];
  $custom_id = 0;
  while($custom_id < count($custom_columns)){
    if($custom_columns[$custom_id][0] != '' && $custom_columns[$custom_id][1] != ''){

      try{
        $sql = "INSERT INTO query_custom_columns SET
                query_id = :query_id,
                to_all_headers = :to_all_headers,
                to_header_element = :to_header_element,
                to_all_data = :to_all_data,
                to_data_element = :to_data_element,
                num_cols = :num_cols";
        $s = $pdo->prepare($sql);
        $s->bindValue(':query_id', $new_query_index);
        $s->bindValue(':custom_id', $custom_id);
        $s->bindValue(':custom_header', $custom_columns[$custom_id][1]);
        $s->bindValue(':custom_path', $custom_columns[$custom_id][1]);
        $s->execute();
      } catch (PDOException $e) {
        echo $e->getMessage();
        exit();
      }

    }
  }
}