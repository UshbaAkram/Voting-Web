const express = require("express");
const mongoose = require("mongoose");
const { connectToMongoDB } = require("./connect");
const { register } = require("./Auth/userAuth");
const router = require("./Auth/userRoute");
const candiRouter = require("./Auth/candidateRoute");
const cookieParser = require("cookie-parser");
const { adminAuth } = require("./middleware/authmiddleware");
const app = express();
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

connectToMongoDB("mongodb://localhost:27017/auth").then(() =>
  console.log("Mongodb connected")
);
// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", router);
app.use("/", candiRouter);
// app.get("/admin", adminAuth, candi );
app.get("/basic", adminAuth, (req, res) => res.send("Welcome basic User "));
app.get("/", (req, res) => {
  return res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login"); // Renders login.ejs
});
app.get("/signup", (req, res) => {
  res.render("register"); // Renders login.ejs
});
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

app.listen(8000, () => console.log("Server Started at 8000 port"));
