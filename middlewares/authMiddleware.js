const Player = require("../models/player");
const Scout = require("../models/scout");
const jwt = require("jsonwebtoken");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (payload.role === "player") {
      user = await Player.findByPk(payload.userId);
    } else if (payload.role === "scout") {
      user = await Scout.findByPk(payload.userId);
    }

    if (!user) {
      return res.status(404).json({ message: "Authentication failed: User not found" });
    }

    req.user = payload; // Save decoded payload (contains userId & role)
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired" });
    }

    return res.status(500).json({
      message: "Error authenticating user: " + error.message,
    });
  }
};

// Restrict access based on role
exports.restrictTo = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: `Access denied. Only ${role}s can perform this action.` });
    }
    next();
  };
};
