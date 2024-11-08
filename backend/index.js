const express = require("express");
const cookieParser = require("cookie-parser");
const pg = require("pg");

const app = express();
app.use(cookieParser());
const connection = new pg.Client();

app.get("/", (req, res) => {
  const id = req.cookies["id"];

  if (!id) res.redirect("/login");

  res.send("Hello World!" + req.signedCookies);
});

app.post("/signup", (req, res) => {
  const { name, forename, password, location, workLocation, phoneNumber, age } =
    req.body;

  connection
    .query(
      "INSERT INTO user ($1, $2, $3, $4, $5, $6) VALUES (name, forname, passord, location, work_location, phone_number, age) RETURNING id",
      [name, forename, password, location, workLocation, phoneNumber, age]
    )
    .then((response) => {
      const id = response.rows[0];
      if (id) res.cookie("id", id);
    })
    .catch((err) => console.error(err));
});

app.post("/login", (req, res) => {
  const { name, password } = req.body;

  connection
    .query("SELECT id FROM user WHERE name = $1 AND password = $2", [
      name,
      password,
    ])
    .then((response) => {
      const id = response.rows[0];
      if (id) res.cookie("id", id);
    });
});

app.listen(3000, () => {
  console.log("SUCCES! The app is running on port 3000");
});
