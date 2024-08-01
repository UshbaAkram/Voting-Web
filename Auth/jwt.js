const jwt = require('jsonwebtoken');
const USER = require('../models/user'); // Adjust the path as needed

const authMiddleware = (req, res, next) => {
  const jwtSecret = "65cf28dec479302302df09feaf7971ee19749b6f09808dfc1decf048764d95d017d439";
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid', error: err.message });
  }
};

module.exports = authMiddleware;
