const express = require("express");
const router = express.Router();
const { createCandidate, updateCandidate, deleteCandidate,vote } = require("./candidate");
const { adminAuth, userAuth } = require("../middleware/authmiddleware");
const jwtAuthMiddleware = require("./jwt");
const Candidate = require("../models/candidate");
const USER = require("../models/user");


router.get("/vote",async (req, res) => {
  const candidates= await Candidate.find();
    res.render("vote", {candidates}); // Renders vote.ejs
  });

router.get('/addCandidate',adminAuth,  (req, res) => {
    res.render("createCandidate"); // Renders vote.ejs
  });
  router.get("/updateCandidate", adminAuth, async (req, res) => {
    const candidates = await Candidate.find();
    res.render("updateCandi", { candidates });
  });
  router.get("/deleteCandidate", adminAuth, async (req, res) => {
    const candidates = await Candidate.find();
    res.render("deleteCandidate", { candidates });
  });

router.post("/candi", adminAuth, createCandidate);
router.post("/updateCandidate",  adminAuth, updateCandidate);
router.post("/deleteCandidate", adminAuth, deleteCandidate);
router.post("/vote", jwtAuthMiddleware, vote);

router.get('/adminDashboard', adminAuth, (req, res) => {
  res.render('forAdmin');
});

module.exports = router;
