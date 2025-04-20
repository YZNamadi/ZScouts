const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  ("Token extracted: ", token); 

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ("Decoded token: ", decoded); 
    req.user = decoded; 
    next();
  } catch (err) {
    ("Error decoding token: ", err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
