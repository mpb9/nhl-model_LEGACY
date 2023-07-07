const NHL_Attributes = require("../utility/nhl_attributes");
const CSV_Utilities = require("./utility_csv");
const CSV_Modifiers = require("./modify_csv");
const CSV_x_SQL = require("./csv_x_sql");

// info: WRITE COMMANDS / CALL PRE-PACKAGED EXECUTERS
main();

async function main() {
  // info: TESTS #1 using ANA.csv with ana_x_game as the table name
  // await test1();
  // info: TESTS #2 using original .csv straight from moneypuck... all_teams_RAW as table_name
  // await test2();
  // info: TEAM_X_GAME method calls
  // await init_team_x_game("moneypuck/TxG", "../data/moneypuck/CSVs");
  // await revert_team_x_game('moneypuck/TxG', '../data/moneypuck/CSVs')
  // await delete_team_x_game('moneypuck/TxG', '')
  // info: MP_GAME_ID_CONVERT method calls
  // await init_mp_game_id_convert("moneypuck/GameID_Convert", "../data/moneypuck/CSVs");
  // await delete_mp_game_id_convert("moneypuck/GameID_Convert", "");
  // await CSV_x_SQL.rename_columns("mp_game_id", "gameId", "mp_game_id");
  // ! TEST GET_PREV_GAME_IDS PHP FILE
}

// info: PERMINANT GENERAL METHOD CALLS
async function delete_sql_table(table_name) {
  await CSV_x_SQL.delete_table(table_name).then(() => console.log(`Deleted: ${table_name}`));
}
async function delete_sql_rows(table_name, condition) {
  await CSV_x_SQL.delete_rows(table_name, condition).then(() => console.log(`Deleted rows in: ${table_name}`));
}
async function insert_sql_rows(table_name, subfolder, sourcepath, appendment) {
  /*   NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team + appendment;
    await CSV_x_SQL.insert_rows(filename, subfolder, sourcepath, __dirname, table_name).then(() =>
      console.log(`Inserted rows in: ${table_name}`)
    );
  }); */

  // info: TEST #1
  // const filename = "CAR" + appendment;

  // info: TEST #2
  NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team + appendment;
    if (team != "ANA") {
      await CSV_x_SQL.insert_rows(filename, subfolder, sourcepath, __dirname, table_name).then(() =>
        console.log(`Inserted ${filename} rows in: ${table_name}`)
      );
    }
  });
}
async function insert_sql_rows__cols_specified(filename, subfolder, sourcepath, specific_headers, table_name) {
  await CSV_x_SQL.insert_rows__cols_specified(filename, subfolder, sourcepath, __dirname, table_name, specific_headers);
}
async function format_csv_date_col(filename, subfolder, sourcepath, __dirname, col_name) {
  let ymd = [0, 4, 4, 6, 6, 8];
  await CSV_Modifiers.format_date_col(filename, subfolder, sourcepath, __dirname, col_name, ymd);
}

// info: TEAM_X_GAME METHODS
async function init_team_x_game(subfolder, sourcepath) {
  NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team;

    await CSV_Utilities.delete_old(filename, subfolder, __dirname);
    await CSV_Utilities.retire_active(filename, subfolder, __dirname);
    await CSV_Modifiers.remove_col(filename, subfolder, sourcepath, __dirname, "name");

    sourcepath = "../data/my_data/" + subfolder;
    await CSV_Modifiers.remove_col(filename, subfolder, sourcepath, __dirname, "playerTeam");
    await CSV_Modifiers.remove_col(filename, subfolder, sourcepath, __dirname, "position");

    await format_csv_date_col(filename, subfolder, sourcepath, __dirname, "gameDate");
    await CSV_Modifiers.format_team_abbr(filename, subfolder, sourcepath, __dirname);
    await CSV_Modifiers.format_home_away(filename, subfolder, sourcepath, __dirname);

    const new_cell_101 = [
      ["gameDate", 0, 10],
      ["~if0", -2, -2],
      ["~if1", -2, -2],
    ];
    const conditions = [
      ["home_or_away", "H", ["team", 0, 3], ["opposingTeam", 0, 3]],
      ["home_or_away", "A", ["team", 0, 3], ["opposingTeam", 0, 3]],
    ];
    await CSV_Modifiers.add_col(filename, subfolder, sourcepath, __dirname, "game_id", new_cell_101, conditions);
    await CSV_Modifiers.remove_col(filename, subfolder, sourcepath, __dirname, "gameId");
    await CSV_Utilities.rename(filename, subfolder, __dirname, filename + "_x_GAME").then(() =>
      console.log(`Created: ${filename}_x_GAME`)
    );
  });
}
async function delete_team_x_game(subfolder, appendment) {
  NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team + appendment;
    await CSV_Utilities.delete_old(filename, subfolder, __dirname);
    await CSV_Utilities.delete_active(filename, subfolder, __dirname).then(() => console.log(`Deleted: ${filename}`));
  });
}
async function revert_team_x_game(subfolder, sourcepath) {
  NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team;

    await CSV_Utilities.delete_old(filename, subfolder, __dirname);
    await CSV_Utilities.retire_active(filename, subfolder, __dirname);
    await CSV_Modifiers.fully_revert(filename, subfolder, sourcepath, __dirname).then(() =>
      console.log(`Reset: ${filename}`)
    );
  });
}
async function create_sql_table_team_x_game(subfolder, sourcepath, appendment) {
  /* NHL_Attributes.nhl_teams.forEach(async (team) => {
    if (team != "ANA") {
      const filename = team + appendment;
      await CSV_x_SQL.create_table(filename, subfolder, sourcepath, __dirname, "team_x_game").then(() =>
        console.log(`Created: ${filename}.txt`)
      );
    }
  }); */

  // info: TEST #1
  /* const filename = "ANA" + appendment;
  await CSV_x_SQL.create_table(filename, subfolder, sourcepath, __dirname, "ana_x_game").then(() =>
    console.log(`Created: ${filename}.txt`)
  ); */

  // info: TEST #2
  const filename = "all_teams" + appendment;
  const table_name = "all_teams_RAW";
  await CSV_x_SQL.create_table(filename, subfolder, sourcepath, __dirname, table_name).then(() =>
    console.log(`Created table: ${table_name}`)
  );
}

// info: MP_GAME_ID_CONVERT METHODS (MP(game_id) -> my(game_id))
async function init_mp_game_id_convert(subfolder, sourcepath) {
  let sql_table_created = false;
  NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team;

    await CSV_Utilities.delete_old(filename, subfolder, __dirname);
    await CSV_Utilities.retire_active(filename, subfolder, __dirname);
    await CSV_Modifiers.create(filename, subfolder, sourcepath, __dirname);
    sourcepath = "../data/my_data/" + subfolder;

    await format_csv_date_col(filename, subfolder, sourcepath, __dirname, "gameDate");
    await CSV_Modifiers.format_team_abbr(filename, subfolder, sourcepath, __dirname);
    await CSV_Modifiers.format_home_away(filename, subfolder, sourcepath, __dirname);

    const new_cell_101 = [
      ["gameDate", 0, 10],
      ["~if0", -2, -2],
      ["~if1", -2, -2],
    ];
    const conditions = [
      ["home_or_away", "H", ["team", 0, 3], ["opposingTeam", 0, 3]],
      ["home_or_away", "A", ["team", 0, 3], ["opposingTeam", 0, 3]],
    ];

    await CSV_Modifiers.add_col(filename, subfolder, sourcepath, __dirname, "game_id", new_cell_101, conditions);

    await CSV_Utilities.rename(filename, subfolder, __dirname, filename + "_MP_G_ID").then(() =>
      console.log(`Created: ${filename}_MP_G_ID`)
    );

    // info: CREATE SQL TABLE
    const table_name = "mp_game_id";
    if (!sql_table_created) {
      sql_table_created = true;
      await CSV_x_SQL.create_table__cols_specified(filename + "_MP_G_ID", "", sourcepath, __dirname, table_name, [
        "game_id",
        "gameId",
      ]);
    } else {
      await CSV_x_SQL.insert_rows__cols_specified(filename + "_MP_G_ID", "", sourcepath, __dirname, table_name, [
        "game_id",
        "gameId",
      ]);
    }
  });
}
async function delete_mp_game_id_convert(subfolder, appendment) {
  NHL_Attributes.nhl_teams.forEach(async (team) => {
    const filename = team + appendment;
    await CSV_Utilities.delete_old(filename, subfolder, __dirname);
    await CSV_Utilities.delete_active(filename, subfolder, __dirname).then(() => console.log(`Deleted: ${filename}`));
  });
}

// info: TEST EXECUTERS
async function test1() {
  // await create_sql_table_team_x_game("moneypuck/TxG", "../data/my_data", "_x_GAME");
  // await insert_sql_rows("ana_x_game", "moneypuck/TxG", "../data/my_data", "_x_GAME");
  // await delete_sql_table("ana_x_game");
  // await delete_sql_rows("ana_x_game", "team = 'CAR';");
}
async function test2() {
  // await create_sql_table_team_x_game("CSVs", "../data/moneypuck", "");
  // await insert_sql_rows("all_teams_RAW", "CSVs", "../data/moneypuck", "");
  // await delete_sql_table("all_teams_RAW");
  // await delete_sql_rows("all_teams_RAW", "team = 'CAR';");
}
