const CSV_Utilities = require("./utility_csv");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

async function create(filename, subfolder, sourcepath, __dirname) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      const file_path = path.join(__dirname, sourcepath, filename) + ".csv";
      fs.createReadStream(file_path)
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push({ id: header, title: header })))
        .on("data", (row) => {
          const new_row = {};
          Object.keys(row).forEach((key) => {
            new_row[key] = row[key];
          });
          rows.push(new_row);
        })
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}
async function remove_col(filename, subfolder, sourcepath, __dirname, col_name) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      const file_path = path.join(__dirname, sourcepath, filename) + ".csv";
      fs.createReadStream(file_path)
        .pipe(csv())
        .on("headers", (headers) => {
          my_headers.push(...headers.filter((head) => head !== col_name).map((head) => ({ id: head, title: head })));
        })
        .on("data", (row) => {
          const new_row = {};
          Object.keys(row).forEach((key) => {
            if (key !== col_name) new_row[key] = row[key];
          });
          rows.push(new_row);
        })
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

/*
  new_c_101 = [ [header, start, end],[const, -1, -1], ['~if'+cond_id, -2, -2]... ] 
  (order by header, as many header/constants as desired)
  conditions = [ [cond_header, cond_val, true[header, start, end], false[...]], ... ] (if cond_header == value) 
*/
async function add_col(filename, subfolder, sourcepath, __dirname, new_header, new_c_101, conditions) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => {
          headers.forEach((header) => my_headers.push({ id: header, title: header }));
          my_headers.push({ id: new_header, title: new_header });
        })
        .on("data", (row) => {
          const new_row = {};
          let new_c = JSON.parse(JSON.stringify(new_c_101)).map((instr) => instr[0]);

          Object.keys(row).forEach((key) => {
            if (new_c_101.some(([hdr, s, e]) => hdr === key && s !== -1 && e !== -1)) {
              new_c[new_c.indexOf(key)] = row[key].slice(
                new_c_101[new_c.indexOf(key)][1],
                new_c_101[new_c.indexOf(key)][2]
              );
            }
            new_row[key] = row[key];
          });

          for (let i = 0; i < new_c_101.length; i++) {
            if (new_c_101[i][0].slice(0, 3) == "~if") {
              const cond_id = Number(new_c_101[i][0].slice(3));
              new_c[i] =
                new_row[conditions[cond_id][0]] == conditions[cond_id][1]
                  ? (new_c[i] = new_row[conditions[cond_id][2][0]].slice(
                      conditions[cond_id][2][1],
                      conditions[cond_id][2][2]
                    ))
                  : (new_c[i] = new_row[conditions[cond_id][3][0]].slice(
                      conditions[cond_id][3][1],
                      conditions[cond_id][3][2]
                    ));
            }
          }
          new_row[new_header] = new_c.join("");
          rows.push(new_row);
        })
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

async function fully_revert(filename, subfolder, sourcepath, __dirname) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push({ id: header, title: header })))
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

// info: ymd = [ yearstart, yearend, monthstart, monthend, daystart, dayend ] ... _end is index after
async function format_date_col(filename, subfolder, sourcepath, __dirname, col_name, ymd) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push({ id: header, title: header })))
        .on("data", (row) => {
          const new_row = {};
          Object.keys(row).forEach((key) => {
            if (key == col_name) {
              new_row[key] =
                row[key].slice(ymd[0], ymd[1]) +
                "-" +
                row[key].slice(ymd[2], ymd[3]) +
                "-" +
                row[key].slice(ymd[4], ymd[5]);
            } else new_row[key] = row[key];
          });
          rows.push(new_row);
        })
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

async function format_team_abbr(filename, subfolder, sourcepath, __dirname) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push({ id: header, title: header })))
        .on("data", (row) => {
          Object.keys(row).forEach((key) => {
            if (row[key] === "T.B") row[key] = "TBL";
            else if (row[key] === "N.J") row[key] = "NJD";
            else if (row[key] === "S.J") row[key] = "SJS";
            else if (row[key] === "L.A") row[key] = "LAL";
          });
          rows.push(row);
        })
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

async function format_home_away(filename, subfolder, sourcepath, __dirname) {
  return new Promise(async (resolve, reject) => {
    const my_headers = [];
    const rows = [];
    try {
      fs.createReadStream(path.join(__dirname, sourcepath, filename) + ".csv")
        .pipe(csv())
        .on("headers", (headers) => headers.forEach((header) => my_headers.push({ id: header, title: header })))
        .on("data", (row) => {
          Object.keys(row).forEach((key) => {
            if (row[key] === "HOME") row[key] = "H";
            else if (row[key] === "AWAY") row[key] = "A";
          });
          rows.push(row);
        })
        .on("end", async () => {
          try {
            await CSV_Utilities.create(filename, subfolder, __dirname, my_headers, rows);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  create,
  remove_col,
  add_col,
  fully_revert,
  format_team_abbr,
  format_home_away,
  format_date_col,
};
