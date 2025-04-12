'use strict';

require('dotenv').config();
const { Player } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailTemplate = require("../utils/signup");
const { Op } = require("sequelize");

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  }
});

// Generate JWT token helper
const genToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      scoutId: user.scoutId,
      fullname: user.fullname,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "50m" }
  );
};

// Sign Up for Player
const signUp = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    if (!fullname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "fullname, email, and password are required." });
    }
    if(password !== confirmPassword){
      return res.status(400).json({message: "password does not match"})
    }
    const existingPlayer = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (existingPlayer) {
      return res.status(400).json({ message: `Player with this email: ${email} already exists.` });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "50m" });

    // Create player
    const player = await Player.create({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      confirmPassword,
      isVerified: false
    });

    // Send verification email
    const verificationLink = `${req.protocol}://${req.get("host")}/api/players/verify-email/${token}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: `Welcome ${fullname}, Kindly use this link to verify your email: ${verificationLink}`,
      html: emailTemplate(verificationLink, fullname)
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: `Check your email: ${email} to verify your account.`,
      data: player
    });

  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Verify Email for Player
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (player.isVerified) {
      return res.status(400).json({ message: "Player already verified" });
    }

    player.isVerified = true;
    await player.save();

    res.status(200).json({ message: "Player verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend Verification Email
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (player.isVerified) {
      return res.status(400).json({ message: "Player already verified" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "50m" });

    const verificationLink = `${req.protocol}://${req.get("host")}/api/players/verify-email/${token}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: player.email,
      subject: "Resend Player Verification",
      html: emailTemplate(verificationLink, fullname)
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: `Verification email sent successfully to ${player.email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find player by email (ensure lowercase match)
    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: player.id,
        fullname: player.fullname,
        email: player.email,
        role: "player"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond with token and user details
    res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: player.id,
        fullname: player.fullname,
        email: player.email,
        role: "player"
      }
    });

  } catch (error) {
    console.error("Player SignIn Error:", error.message);
    res.status(500).json({ message: "Error logging in: " + error.message });
  }
};


// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const resetToken = jwt.sign({ playerId: player.id }, process.env.JWT_SECRET, { expiresIn: "30m" });

    const resetLink = `${req.protocol}://${req.get("host")}/api/players/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: player.email,
      subject: "Player Password Reset",
      html: `Please click on the link to reset your password: <a href="${resetLink}">Reset Password</a>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword} = req.body;

    // Verify token
    const { playerId } = jwt.verify(token, process.env.JWT_SECRET);

    // Find player
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    player.password = hashedPassword;
    await player.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Search Players
const searchPlayers = async (req, res) => {
  try {
    const { position, nationality, minRating, maxRating } = req.query;

    let query = {};

    if (position) {
      query.primaryPosition = position;
    }
    if (nationality) {
      query.nationality = nationality;
    }
    if (minRating || maxRating) {
      query.averageRating = {};
      if (minRating) query.averageRating[Op.gte] = parseFloat(minRating);
      if (maxRating) query.averageRating[Op.lte] = parseFloat(maxRating);
    }

    const players = await Player.findAll({ where: query });

    return res.status(200).json(players);
  } catch (error) {
    console.error("Error searching for players:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Sign Out

const revokedTokens = new Set();

const signOut = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    revokedTokens.add(token); // Add the token to the blacklist

    res.status(200).json({ message: "Player signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlayerContact = async (req, res) => {
  try {
    // Get player ID from route parameters
    const { id: playerId } = req.params;
    // Scout's email is expected to be available in req.user (set by your authentication middleware)
    const scoutEmail = req.user.email;

    // Find the player record by primary key
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Check if the scout has a successful payment transaction
    // This assumes that a transaction record exists with the scout's email and a status of 'successful'
    const transaction = await Transaction.findOne({
      where: {
        email: scoutEmail,
        status: "successful"
      }
    });

    if (!transaction) {
      return res.status(403).json({ message: "You must complete the payment to access player contact details." });
    }

    // Return player contact details (customize as needed)
    return res.status(200).json({
      message: "Player contact details retrieved successfully.",
      data: {
        fullName: player.fullName,
        email: player.email,
        phoneNumber: player.phoneNumber
      }
    });
  } catch (error) {
    console.error("Error retrieving player contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signUp,
  verifyEmail,
  resendVerificationEmail,
  signIn,
  forgotPassword,
  resetPassword,
  signOut,
  searchPlayers,
  getPlayerContact
};
