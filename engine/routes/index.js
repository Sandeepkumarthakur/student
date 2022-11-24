var router = require("express").Router();
const db = require("../db");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const send_mail = require("../mail");

router.get("/students", async function (req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.send({ message: "Unauthorised", status: 0 });
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    res.send({ message: "Unauthorised", status: 0 });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "SECRET");
  } catch (err) {
    res.send({ message: "Unauthorised", status: 0 });
  }

  if (!decodedToken) {
    res.send({ message: "Unauthorised", status: 0 });
  }
  const query = req?.query?.query;
  var sql;
  // console.log("query", query, req.query);
  if (query == undefined) {
    sql = "SELECT * FROM Student";
    db.query(sql, function (err, results) {
      if (err) {
        console.log(err);
        res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
      } else {
        res.send({ mesaage: "Students list", data: results, status: 1 });
      }
    });
  } else {
    sql = "SELECT * FROM Student WHERE location LIKE ?";
    db.query(sql, ["%" + query + "%"], function (err, results) {
      if (err) {
        console.log(err);
        res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
      } else {
        res.send({ mesaage: "Students list", data: results, status: 1 });
      }
    });
  }
});

router.post("/signup", async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      res.send({ message: "INTERNAL SERVER ERROR" });
    } else {
      var sql = "INSERT INTO User(id, email, name, password) VALUES ?";
      db.query(sql, [[[uuidv4(), email, name, hash]]], (err, result) => {
        if (err) {
          res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
        } else {
          res.send({ message: "Successfully signed up", status: 1 });
        }
      });
    }
  });
});

router.put("/update", async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) {
      res.send({ message: "INTERNAL SERVER ERROR" });
    } else {
      var sql = "UPDATE User SET password = ? WHERE email = ?";
      db.query(sql, [hash, email], (err, result) => {
        if (err) {
          res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
        } else {
          res.send({ message: "Successfully updated password", status: 1 });
        }
      });
    }
  });
});

router.post("/login", async function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var sql = "SELECT * FROM User WHERE email = ?";
  db.query(sql, [email], function (err, result) {
    if (err) {
      res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
    } else {
      if (result.length < 1) {
        res.send({ message: "User not found", status: 0 });
      } else {
        console.log(result[0].password);
        bcrypt.compare(password, result[0].password, function (err, r) {
          if (r == true) {
            const token = jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                data: {
                  email: result[0].email,
                  name: result[0].name,
                  id: result[0].id,
                },
              },
              "SECRET"
            );
            res.send({
              message: "Login Successfully",
              token: token,
              user: {
                email: result[0].email,
                name: result[0].name,
                id: result[0].id,
              },
              status: 1,
            });
          } else {
            res.send({ message: "Invalid Password", status: 0 });
          }
        });
      }
    }
  });
});

router.post("/reset", async function (req, res) {
  const email = req.body.email;
  var sql = "SELECT * FROM User WHERE email = ?";
  db.query(sql, [email], async function (err, result) {
    if (err) res.send({ message: "INTERNAL SERVER ERROR" });
    else {
      if (result.length < 1) {
        res.send({ message: "User not found", status: 0 });
      } else {
        const token = jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            data: {
              email: result[0].email,
              name: result[0].name,
              id: result[0].id,
            },
          },
          "EMAIL-SECRET"
        );
        try {
          const t = await send_mail(
            result[0].name,
            result[0].email,
            "http://localhost:3000/auth/reset?token=" + token
          );
          console.log(token, t);
          res.send({ message: "Email sent to " + email, status: 1, token });
        } catch (err) {
          res.send({ message: "INTERNAL SRVER ERROR", status: 0 });
        }
      }
    }
  });
});

router.get("/verify", async function (req, res) {
  const token = req.query.token;
  console.log(token);
  jwt.verify(token, "EMAIL-SECRET", function (err, decoded) {
    if (err) res.send({ message: "invalid", status: 0 });
    else
      res.send({
        message: "Successfully verified",
        status: 1,
        user: decoded.data,
      });
  });
});

router.get("/passfail", async function (req, res) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.send({ message: "Unauthorised", status: 0 });
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    res.send({ message: "Unauthorised", status: 0 });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "SECRET");
  } catch (err) {
    res.send({ message: "Unauthorised", status: 0 });
  }

  if (!decodedToken) {
    res.send({ message: "Unauthorised", status: 0 });
  }
  db.query(
    `select status, count(*) as c from student group by status`,
    function (err, result) {
      if (err) {
        res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
      } else {
        res.send({ data: result, status: 1 });
      }
    }
  );
});
router.get("/passfailloc", async function (req, res) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    res.send({ message: "Unauthorised", status: 0 });
  }
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    res.send({ message: "Unauthorised", status: 0 });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "SECRET");
  } catch (err) {
    res.send({ message: "Unauthorised", status: 0 });
  }

  if (!decodedToken) {
    res.send({ message: "Unauthorised", status: 0 });
  }
  db.query(
    `select location, status,count(*) as c from student group by location , status `,
    function (err, result) {
      if (err) {
        res.send({ message: "INTERNAL SERVER ERROR", status: 0 });
      } else {
        res.send({ data: result, status: 1 });
      }
    }
  );
});
module.exports = router;
