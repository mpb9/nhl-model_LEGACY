const csv = require("csv-parser");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const NHL_Attributes = require("../utility/nhl_attributes");

// info: makes sql "CREATE TABLE" command
async function create_table(filename, subfolder, sourcepath, __dirname, tablename) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, subfolder, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push(header)))
        .on("data", (row) => {
          const temp_row = [];
          Object.keys(row).forEach((key) => {
            temp_row.push(row[key]);
          });
          rows.push(temp_row);
        })
        .on("end", async () => {
          const table_data = {
            table_name: tablename,
            headers: my_headers,
            rows: rows,
          };
          await axios({
            method: "post",
            url: "http://localhost/bet-apis/sql-data/new_table.php",
            headers: { "Content-Type": "application/json" },
            data: table_data,
          }).catch((error) => {
            console.log(error);
          });
          resolve();
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

// info: makes sql "CREATE TABLE" command
async function create_table__cols_specified(filename, subfolder, sourcepath, __dirname, tablename, specific_headers) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, subfolder, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) =>
          headers.forEach((header) => {
            if (specific_headers.includes(header)) my_headers.push(header);
          })
        )
        .on("data", (row) => {
          const temp_row = [];
          Object.keys(row).forEach((key) => {
            if (specific_headers.includes(key)) temp_row.push(row[key]);
          });
          rows.push(temp_row);
        })
        .on("end", async () => {
          const table_data = {
            table_name: tablename,
            headers: my_headers,
            rows: rows,
          };
          await axios({
            method: "post",
            url: "http://localhost/bet-apis/sql-data/new_table.php",
            headers: { "Content-Type": "application/json" },
            data: table_data,
          }).catch((error) => {
            console.log(error);
          });
          resolve();
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

// info: makes sql "DELETE TABLE" command
async function delete_table(table_name) {
  return new Promise(async (resolve, reject) => {
    try {
      const table_data = {
        table_name: table_name,
      };
      await axios({
        method: "post",
        url: "http://localhost/bet-apis/sql-data/delete_table.php",
        headers: { "Content-Type": "application/json" },
        data: table_data,
      }).catch((error) => {
        console.log(error);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// info: makes sql "INSERT INTO" command
async function insert_rows(filename, subfolder, sourcepath, __dirname, tablename) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, subfolder, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push(header)))
        .on("data", (row) => {
          const temp_row = [];
          Object.keys(row).forEach((key) => {
            temp_row.push(row[key]);
          });
          rows.push(temp_row);
        })
        .on("end", async () => {
          const table_data = {
            table_name: tablename,
            headers: my_headers,
            rows: rows,
          };
          await axios({
            method: "post",
            url: "http://localhost/bet-apis/sql-data/insert_data.php",
            headers: { "Content-Type": "application/json" },
            data: table_data,
          }).catch((error) => {
            console.log(error);
          });
          resolve();
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

// info: makes sql "INSERT INTO" command
async function insert_rows__cols_specified(filename, subfolder, sourcepath, __dirname, tablename, specific_headers) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, subfolder, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) =>
          headers.forEach((header) => {
            if (specific_headers.includes(header)) my_headers.push(header);
          })
        )
        .on("data", (row) => {
          const temp_row = [];
          Object.keys(row).forEach((key) => {
            if (specific_headers.includes(key)) temp_row.push(row[key]);
          });
          rows.push(temp_row);
        })
        .on("end", async () => {
          const table_data = {
            table_name: tablename,
            headers: my_headers,
            rows: rows,
          };
          await axios({
            method: "post",
            url: "http://localhost/bet-apis/sql-data/insert_data.php",
            headers: { "Content-Type": "application/json" },
            data: table_data,
          }).catch((error) => {
            console.log(error);
          });
          resolve();
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

// info: makes sql "DELETE FROM" command
async function delete_rows(table_name, condition) {
  return new Promise(async (resolve, reject) => {
    try {
      const table_data = {
        table_name: table_name,
        condition: condition,
      };
      await axios({
        method: "post",
        url: "http://localhost/bet-apis/sql-data/delete_data.php",
        headers: { "Content-Type": "application/json" },
        data: table_data,
      }).catch((error) => {
        console.log(error);
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// info: makes sql "ALTER TABLE" command
async function add_columns(filename, subfolder, sourcepath, __dirname, tablename) {}

// info: makes sql "ALTER TABLE" command
async function change_columns(filename, subfolder, sourcepath, __dirname, tablename) {}

// info: makes sql "ALTER TABLE" command
async function rename_columns(tablename, old_header, new_header) {}

module.exports = {
  create_table,
  create_table__cols_specified,
  insert_rows,
  insert_rows__cols_specified,
  delete_rows,
  delete_table,
  add_columns,
  change_columns,
  rename_columns,
};
