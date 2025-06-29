require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

const database = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;

  //lmao
  if (/^http:\/\/localhost:3000\/\?v=\d{13}$/.test(url)) {
    database.push({
      original_url: url,
      short_url: database.length + 1,
    });

    res.send(database[database.length - 1]);
  } else {
    res.send({ error: "invalid url" });
  }
});

app.get(
  "/api/shorturl/:short",
  function (req, res, next) {
    const shorturl = database.find((url, i) => i + 1 == req.params.short);

    if (shorturl) {
      res.redirect(shorturl.original_url);
    }

    next();
  },
  function (req, res) {
    res.send();
  },
);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
