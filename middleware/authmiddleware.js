const jwt = require("jsonwebtoken");
const jwtSecret =
  "65cf28dec479302302df09feaf7971ee19749b6f09808dfc1decf048764d95d017d439";
const adminAuth = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodeToken) => {
      console.log(decodeToken)
      if (err) {        
        return res.status(401).json({ message: "Not authorized" });
      } else if (decodeToken.role !== "admin") {
        return res.status(401).json({ message: "Not authorized not an admin" });
      } else {
        next();
      }
    });
  }
  else{
    return res.status(401).json({ message: "Not authorized, token not available" })
  }
};

const userAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, jwtSecret, (err, decodeToken) => {
        if (err) {
          return res.status(401).json({ message: "Not authorized" });
        } else if (decodeToken.role !== "voter") {
          return res.status(401).json({ message: "Not authorized" });
        } else {
          next();
        }
      });
    }
    else{
      return res.status(401).json({ message: "Not authorized, token not available" })
    }
  };
  module.exports={adminAuth, userAuth}