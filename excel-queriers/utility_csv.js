const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function create(filename, subfolder, __dirname, my_headers, rows) {
  const outputFile = get_active_filepath(filename, subfolder, __dirname);
  try {
    const csvWriter = createCsvWriter({
      path: outputFile,
      header: my_headers,
    });
    await csvWriter.writeRecords(rows);
    //console.log(`CREATED: ${outputFile.slice(43)}`);
  } catch(error) {
    throw error;
  }
}

async function rename(filename, subfolder, __dirname, new_name){
  const orig_activeFilePath = get_active_filepath(filename, subfolder, __dirname);
  const new_activeFilePath = get_active_filepath(new_name, subfolder, __dirname);
  const orig_oldFilePath = get_old_filepath(filename, subfolder, __dirname);
  const new_oldFilePath = get_old_filepath(new_name, subfolder, __dirname);
  try {
    await fs.promises.rename(orig_activeFilePath, new_activeFilePath);
    await fs.promises.rename(orig_oldFilePath, new_oldFilePath);
  } catch (error) {
    if(error.code !== 'ENOENT') throw error;
  }
}

async function delete_active(filename, subfolder, __dirname){
  const newFilePath = get_active_filepath(filename, subfolder, __dirname);
  try {
    await fs.promises.unlink(newFilePath);
    //console.log(`../${newFilePath.slice(43)} DELETED.`);
  } catch(error) {
    if(error.code !== 'ENOENT') throw error;
  }
}
async function delete_old(filename, subfolder, __dirname) {
  const oldFilePath = get_old_filepath(filename, subfolder, __dirname);
  try {
    await fs.promises.unlink(oldFilePath);
    //console.log(`../${oldFilePath.slice(43)} DELETED.`);
  } catch(error) {
    if(error.code !== 'ENOENT') throw error;
  }
}

async function retire_active(filename, subfolder, __dirname) {
  const newFilePath = get_active_filepath(filename, subfolder, __dirname);
  const oldFilePath = get_old_filepath(filename, subfolder, __dirname);
  try {
    await fs.promises.rename(newFilePath, oldFilePath);
    //console.log(`../${newFilePath.slice(43)} --> ../${oldFilePath.slice(43)}`);
  } catch(error) {
    if(error.code !== 'ENOENT') throw error;
  }
}
async function unretire_old(filename, subfolder, __dirname) {
  const currentFilePath = get_active_filepath(filename, subfolder, __dirname);
  const oldFilePath = get_old_filepath(filename, subfolder, __dirname);
  const tempFilePath= 'TEMP_' + current_filePath;
  try {
    await fs.promises.rename(currentFilePath, tempFilePath);
    await fs.promises.rename(oldFilePath, currentFilePath);
    await fs.promises.rename(tempFilePath, oldFilePath);
    //console.log(`../${oldFilePath.slice(43)} --> ../${currentFilePath.slice(43)}`);
  } catch(error) {
    if(error.code !== 'ENOENT') throw error;
  }
}

function get_active_filepath(filename, subfolder, __dirname){
  let newFilePath = path.join(__dirname, '../data/my_data', subfolder, filename);
  return newFilePath + '.csv';
}
function get_old_filepath(filename, subfolder, __dirname){
  let oldFilePath = path.join(__dirname, '../data/my_data/old', filename);
  return oldFilePath + '_OLD.csv';
}

// 107 Total
const TxG_headers = [
  'team', 'season', 'opposingTeam', 'home_or_away', 'gameDate', 'situation', 
  'xGoalsPercentage', 'corsiPercentage', 'fenwickPercentage', 'iceTime', 

  'xOnGoalFor', 'xGoalsFor', 
  'xReboundsFor', 'xFreezeFor', 'xPlayStoppedFor', 'xPlayContinuedInZoneFor', 'xPlayContinuedOutsideZoneFor', 
  'flurryAdjustedxGoalsFor', 'scoreVenueAdjustedxGoalsFor', 'flurryScoreVenueAdjustedxGoalsFor', 
  'shotsOnGoalFor', 'missedShotsFor', 'blockedShotAttemptsFor', 'shotAttemptsFor', 
  'goalsFor', 'reboundsFor', 'reboundGoalsFor', 
  'freezeFor', 'playStoppedFor', 'playContinuedInZoneFor', 'playContinuedOutsideZoneFor', 
  'savedShotsOnGoalFor', 'savedUnblockedShotAttemptsFor', 
  'penaltiesFor', 'penalityMinutesFor', 'faceOffsWonFor', 'hitsFor', 'takeawaysFor', 'giveawaysFor', 
  'lowDangerShotsFor', 'mediumDangerShotsFor', 'highDangerShotsFor', 
  'lowDangerxGoalsFor', 'mediumDangerxGoalsFor', 'highDangerxGoalsFor', 
  'lowDangerGoalsFor', 'mediumDangerGoalsFor', 'highDangerGoalsFor', 
  'scoreAdjustedShotsAttemptsFor', 'unblockedShotAttemptsFor', 'scoreAdjustedUnblockedShotAttemptsFor', 
  'dZoneGiveawaysFor', 
  'xGoalsFromxReboundsOfShotsFor', 'xGoalsFromActualReboundsOfShotsFor', 'reboundxGoalsFor', 
  'totalShotCreditFor', 'scoreAdjustedTotalShotCreditFor', 'scoreFlurryAdjustedTotalShotCreditFor', 

  'xOnGoalAgainst', 'xGoalsAgainst', 
  'xReboundsAgainst', 'xFreezeAgainst', 'xPlayStoppedAgainst', 'xPlayContinuedInZoneAgainst', 'xPlayContinuedOutsideZoneAgainst', 
  'flurryAdjustedxGoalsAgainst', 'scoreVenueAdjustedxGoalsAgainst', 'flurryScoreVenueAdjustedxGoalsAgainst', 
  'shotsOnGoalAgainst', 'missedShotsAgainst', 'blockedShotAttemptsAgainst', 'shotAttemptsAgainst', 
  'goalsAgainst', 'reboundsAgainst', 'reboundGoalsAgainst', 
  'freezeAgainst', 'playStoppedAgainst', 'playContinuedInZoneAgainst', 'playContinuedOutsideZoneAgainst', 
  'savedShotsOnGoalAgainst', 'savedUnblockedShotAttemptsAgainst', 
  'penaltiesAgainst', 'penalityMinutesAgainst', 'faceOffsWonAgainst', 'hitsAgainst', 'takeawaysAgainst', 'giveawaysAgainst', 
  'lowDangerShotsAgainst', 'mediumDangerShotsAgainst', 'highDangerShotsAgainst', 
  'lowDangerxGoalsAgainst', 'mediumDangerxGoalsAgainst', 'highDangerxGoalsAgainst', 
  'lowDangerGoalsAgainst', 'mediumDangerGoalsAgainst', 'highDangerGoalsAgainst', 
  'scoreAdjustedShotsAttemptsAgainst', 'unblockedShotAttemptsAgainst', 'scoreAdjustedUnblockedShotAttemptsAgainst', 
  'dZoneGiveawaysAgainst', 
  'xGoalsFromxReboundsOfShotsAgainst', 'xGoalsFromActualReboundsOfShotsAgainst', 'reboundxGoalsAgainst', 
  'totalShotCreditAgainst', 'scoreAdjustedTotalShotCreditAgainst', 'scoreFlurryAdjustedTotalShotCreditAgainst', 

  'game_id'
];

module.exports = {
  create,
  rename,
  delete_active,
  delete_old,
  retire_active,
  unretire_old,
  TxG_headers
};