const jwt = require("jsonwebtoken");
const isAuthenticated = (req, res) => {
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
};

module.exports = isAuthenticated;
