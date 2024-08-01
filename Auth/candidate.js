const Candidate = require("../models/candidate");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const USER = require("../models/user");

const createCandidate=async(req,res)=>{
    const{ name, age, party }=req.body;
    console.log("i am candidate "+ name, age, party)
    const candi = await Candidate.create({
        name: name,
        party: party,
        // votes : votes,
        age: age,
    })

    return res.status(200).json({ message: "Candidate Created Successfully",candi });
}


const vote = async (req, res) => {
    try {
      const { candidateId } = req.body;
      const userId = req.user.id;
    //   console.log(userId)
      const user = await USER.findById(userId);
    //   console.log(user)
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.isVoted) {
        return res.status(400).json({ message: "User has already voted" });
      }
  
      const candidate = await Candidate.findById(candidateId);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
  
      user.isVoted = true;
      user.votedCandidate = candidateId;
      await user.save();
  
      candidate.voteCount += 1;
      await candidate.save();
  
      res.status(200).json({ message: "Vote cast successfully" });
    } catch (err) {
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };

// const updateCandi=async(req,res)=>{
//     const {id, name,party,age} = req.body
//     console.log("I am from Update candi "+id,name,party,age)
   
//     const response = await Candidate.findByIdAndUpdate(id, {name,party,age}, {
//         new: true, // Return the updated document
//         runValidators: true, // Run Mongoose validation
// })
// if (!response) {
//     return res.status(404).json({ error: 'Candidate not found' });
// }

// console.log('candidate data updated');
// res.status(200).json(response);
// }

const updateCandidate = async (req, res) => {
  const { id, name, party } = req.body;
  
  try {
    const candidate = await Candidate.findById(id);
    
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    
    if (name) candidate.name = name;
    if (party) candidate.party = party;
    
    await candidate.save();
    
    res.status(200).json({ message: "Candidate updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update candidate", error: err.message });
  }
};
const deleteCandidate = async (req, res) => {
    try {
      const { id } = req.body;
      console.log(id)
      await Candidate.findByIdAndDelete(id);
      res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "An error occurred", error: err.message });
    }
  };

module.exports={createCandidate,vote , updateCandidate , deleteCandidate }