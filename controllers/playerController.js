require('dotenv').config();
const { Player } = require('../models'); // Sequelize model for Players
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const emailTemplate= require("../utils/signup")


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
      fullname: user.fullname,
      email: user.email,
      role: 'player'
    },
    process.env.JWT_SECRET,
    { expiresIn: "50m" }
  );
};

// Sign Up for Player
const signUp = async (req, res) => {
  try {
  

    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "fullname, email, and password are required." });
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
      role: 'player',
      isVerified: false
    });

    // Send verification email
const verificationLink = `${req.protocol}://${req.get("host")}/api/scouts/verify-email/${token}`;
const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: `Welcome ${newUser.username}, Kindly use this link to verify your email: ${verificationLink}`,
  html: emailTemplate(verificationLink, newUser.username)
};

await transporter.sendMail(mailOptions);

res.status(201).json({
  message: `Check your email: ${newUser.email} to verify your account.`,
  data: player,
  token
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

    res.status(200).json({ message: "Player verified successfully", data: player });
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
      html: `Please click on the link to verify your email: <a href="${verificationLink}">Verify Email</a>`
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

    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(404).json({ message: `Player with email: ${email} not found.` });
    }

    if (!player.isVerified) {
      return res.status(400).json({ message: `Player with email: ${email} is not verified.` });
    }

    const isPassword = await bcrypt.compare(password, player.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = genToken(player);

    res.status(200).json({ message: "Player Sign In successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, existingPassword } = req.body;

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const playerId = decodedToken.playerId;

    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const isPasswordMatch = await bcrypt.compare(existingPassword, player.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Existing password does not match" });
    }

    player.password = await bcrypt.hash(password, 10);
    await player.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign Out
const revokedTokens = new Set();
const signOut = (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Invalid token" });
  }

  revokedTokens.add(token);
  res.status(200).json({ message: "Player signed out successfully" });
};

module.exports = {
  signUp,
  verifyEmail,
  resendVerificationEmail,
  signIn,
  forgotPassword,
  resetPassword,
  signOut,
};
