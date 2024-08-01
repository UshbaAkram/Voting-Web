const USER = require("../models/user");
const Candidate = require("../models/candidate");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const jwtSecret =
    "65cf28dec479302302df09feaf7971ee19749b6f09808dfc1decf048764d95d017d439";
  const { name, CNIC, password, age, address,email} = req.body;
  console.log(
    "i am user Auth" + name,
    CNIC,
    password,
    age,
    address,
    email,
    // role
  );
  if (password < 6) {
    return res.status(400).json("message: Password must be 6 character long");
  }

  bcrypt.hash(password, 10).then(async (hash) => {
    const user = await USER.create({
      name: name,
      password: hash,
      CNIC: CNIC,
      address: address,
      age: age,
      email:email
      // role,
    });

    const maxAge = 3 * 60 * 60;
    const token = jwt.sign({ id: user._id, name, role: user.role }, jwtSecret, {
      expiresIn: maxAge, // 3hrs in sec
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });

    res.status(200).json({ message: "User Created Successfully", user });
  });
  return res.render("register", { message: "User Created Successfully" });
};

const login = async (req, res, next) => {
  const jwtSecret =
    "65cf28dec479302302df09feaf7971ee19749b6f09808dfc1decf048764d95d017d439";
  const { CNIC, password, name } = req.body;
  // console.log(CNIC)
  const user = await USER.findOne({ CNIC });
  // console.log(user)

  if (user == null) {
    return res.json({
      message: "Login not successful1",
      error: "User not found",
    });
  } else {
    bcrypt.compare(password, user.password).then((result) => {
      if (result) {
        console.log(result);
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, name, role: user.role },
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        if(user.role=="voter"){
          res.render("forVoters")
        }
        else if(user.role=="admin"){
          res.render("forAdmin")
        }
        // res.status(200).json({
        //   message: "Login successful",
        //   user,
        // });
      } else res.status(400).json({ message: "Login not successfull2" });
    });
    //
  }
  if (!name || !password) {
    return res.json({
      message: "Username or Password not present",
    });
  }
};

const update = async (req, res, next) => {
  const { CNIC, role } = req.body;
  if (role && CNIC) {
    console.log(CNIC);
    const user = await USER.findOne({ CNIC: CNIC });
    console.log(user);
    if (user.role === "admin") {
      return res.json("Already an Admin ");
    } else {
      user.role = "admin";
      user.save();
      return res.json("Now an admin ");
    }
  }
};

getUsers = async (req, res, next) => {
  await USER.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.name = user.name;
        container.role = user.role;
        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};

const profile = async (req, res, next) => {
  try {
    // Assuming the logged-in user's ID is stored in req.user.id
    const userId = req.user.id;

    // Find the user by ID
    const user = await USER.findById(userId);

    // Check if user is found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Construct the response object
    // const userResponse = {
    //   name: user.name,
    //   role: user.role
    // };

    // Send the response
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ message: "Not successful", error: err.message });
  }
};

const getLiveResults = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.render("liveResults", { candidates });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
module.exports = { register, login, update, getUsers, profile,getLiveResults };
