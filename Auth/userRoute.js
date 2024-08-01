const express = require("express");
const router = express.Router();
const { register, login, update, getUsers, profile, getLiveResults } = require("./userAuth");
const authMiddleware = require("./jwt");

// router.route('/login').post(login)   // same
router.post("/login", login);
router.route("/signup").post(register);
router.post("/update", update);
router.get("/getUsers", authMiddleware, getUsers);
router.get("/profile", authMiddleware, profile);

router.get("/liveResults", authMiddleware, getLiveResults);
module.exports = router;
