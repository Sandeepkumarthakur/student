require("dotenv").config();
const app = require("express")();
const routes = require("./routes/index");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(routes);
app.listen(process.env.PORT, () => {
  console.log("Server started on " + process.env.PORT);
});
