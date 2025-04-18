const { Player } = require("../models");
const { Scout } = require("../models");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  try {
    // Retrieve token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"

    // If token is not present in the request header
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    // Verify token and decode payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user based on role (either 'player' or 'scout')
    let user;
    if (payload.role === "player") {
      user = await Player.findByPk(payload.userId); // For player, fetch from Player table
    } else if (payload.role === "scout") {
      user = await Scout.findByPk(payload.userId); // For scout, fetch from Scout table
    }

    // If no user is found for the decoded token's userId
    if (!user) {
      return res.status(404).json({ message: "Authentication failed: User not found" });
    }

    // Attach the decoded payload to the request object for later use
    req.user = user;  // Attach user data directly, not just the payload, for better access to user details
    next();
  } catch (error) {
    // If the token has expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired" });
    }

    // Catch any other error
    return res.status(500).json({
      message: "Error authenticating user: " + error.message,
    });
  }
};

// Restrict access based on user role
exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: `Access denied. Only ${role}s can perform this action.` });
    }
    next();
  };
};



exports.adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isAdmin === true) {
      req.user = decoded; 
      next();
    } else {
      res.status(403).json({ message: "Unauthorized: Not an Admin" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
