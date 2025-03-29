require('dotenv').config();
const { Player } = require('../models'); // Sequelize model for Players
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
    secure: false
  }
});

// Generate token helper
const genToken = async (user) => {
  try {
    const token = await jwt.sign({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: 'player'
    }, process.env.JWT_SECRETE, { expiresIn: "50m" });
    return token;
  } catch (error) {
    console.error("Token generation error:", error.message);
    throw error;
  }
};

// Sign Up for Player
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if email already exists using Sequelize query
    const existingPlayer = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (existingPlayer) {
      return res.status(400).json({
        message: `Player with this email: ${email} already exists.`
      });
    }

    // Salt and hash the password
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    // Create a verification token
    const token = await jwt.sign({ email }, process.env.JWT_SECRETE, { expiresIn: "50m" });

    // Create the player record (role is set as 'player')
    const player = await Player.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'player',
      isVerified: false
    });

    // Prepare verification email
    const verificationLink = `${req.protocol}://${req.get("host")}/api/players/verify-email/${token}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Your Player Account",
      html: `Please click on the link to verify your email: <a href="${verificationLink}">Verify Email</a>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: `Check your email: ${player.email} to verify your account.`,
      data: player,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email for Player
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // Verify the token
    const { email } = jwt.verify(token, process.env.JWT_SECRETE);
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

// Resend Verification Email for Player
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
    const token = await jwt.sign({ email }, process.env.JWT_SECRETE, { expiresIn: "50m" });
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

// Sign In for Player
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(404).json({ message: `Player with email: ${email} not found.` });
    } else if (!player.isVerified) {
      return res.status(400).json({ message: `Player with email: ${email} is not verified.` });
    }
    const isPassword = await bcrypt.compare(password, player.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = await genToken(player);
    res.status(200).json({ message: "Player Sign In successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password for Player
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    const resetToken = await jwt.sign({ playerId: player.id }, process.env.JWT_SECRETE, { expiresIn: "30m" });
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

// Reset Password for Player
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, existingPassword } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
    const playerId = decodedToken.playerId;
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    const isPasswordMatch = await bcrypt.compare(existingPassword, player.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Existing password does not match" });
    }
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);
    player.password = hashedPassword;
    await player.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign Out for Player
const revokedTokens = new Set();
const signOut = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    revokedTokens.add(token);
    res.status(200).json({ message: "Player signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  revokedTokens,
};
