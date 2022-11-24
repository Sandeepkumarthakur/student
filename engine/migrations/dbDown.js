const db = require("../db");

db.query("DROP TABLE Student", (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});

db.query("DROP TABLE User", (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});
