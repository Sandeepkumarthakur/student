const db = require("../db");
const reader = require("xlsx");
// Drop Table
db.query("DROP TABLE Student", (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});

//Create Table
var sql = `CREATE TABLE Student(student_id VARCHAR(20) PRIMARY KEY, first_name VARCHAR(20), last_name VARCHAR(20),location VARCHAR(20),english int,maths int,chemistry int,physics int,biology int,history int, geography int, status varchar(20))`;
db.query(sql, (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});

//Reading xlsx file
const file = reader.readFile("../resources/file.xlsx");
const sheets = file.SheetNames;
let values = [];
var sql =
  "INSERT INTO Student (student_id, first_name, last_name, location, english, maths, chemistry, physics, biology, history, geography) VALUES ?";
for (let i = 0; i < sheets.length; i++) {
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
  temp.forEach((res) => {
    values.push(Object.values(res));
  });
}

// Inserting data into table
db.query(sql, [values], function (err, result) {
  if (err) throw err;
  console.log("Number of records inserted: " + result.affectedRows);
});

sql = "DROP TABLE User";
db.query(sql, (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});

var sql = `UPDATE Student 
SET status = (if(maths+englis+chemistry+physics+biology+history+geography)/7 > 3.5, "PASS", "FAIL")`;
db.query(sql, (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});

var sql = `CREATE TABLE User(id VARCHAR(20) PRIMARY KEY, email VARCHAR(20) UNIQUE, name VARCHAR(20), password VARCHAR(500))`;
db.query(sql, (err, rows, fields) => {
  if (err) throw err;
  console.log("The solution is: ", rows);
});
