require('dotenv').config();
const scoutModel = require('../models/scoutModel'); // Ensure this model exists with fields like username, email, password, isVerified, etc.
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

// Generate JWT token helper for scouts
const genToken = async (user) => {
  try {
    const token = await jwt.sign({
      userId: user._id,
      username: user.username,
      email: user.email,
      role: 'scout'
    }, process.env.JWT_SECRETE, { expiresIn: "50m" });
    return token;
  } catch (error) {
    console.error("Token generation error:", error.message);
    throw error;
  }
};

// Scout Sign Up
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingScout = await scoutModel.findOne({ email: email.toLowerCase() });
    if (existingScout) {
      return res.status(400).json({ message: `Scout with email: ${email} already exists.` });
    }
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);
    const token = await jwt.sign({ email }, process.env.JWT_SECRETE, { expiresIn: "50m" });

    const scout = new scoutModel({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'scout',
      isVerified: false
    });

    const verificationLink = `${req.protocol}://${req.get("host")}/api/scouts/verify-email/${token}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify Your Scout Account",
      html: `Please click on the link to verify your email: <a href="${verificationLink}">Verify Email</a>`
    };

    await transporter.sendMail(mailOptions);
    const savedScout = await scout.save();

    res.status(201).json({ message: `Check your email: ${savedScout.email} to verify your scout account.`, data: savedScout, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Scout Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRETE);
    const scout = await scoutModel.findOne({ email: email.toLowerCase() });
    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }
    if (scout.isVerified) {
      return res.status(400).json({ message: "Scout already verified" });
    }
    scout.isVerified = true;
    await scout.save();
    res.status(200).json({ message: "Scout verified successfully", data: scout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend Verification Email for Scout
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const scout = await scoutModel.findOne({ email: email.toLowerCase() });
    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }
    if (scout.isVerified) {
      return res.status(400).json({ message: "Scout already verified" });
    }
    const token = await jwt.sign({ email }, process.env.JWT_SECRETE, { expiresIn: "50m" });
    const verificationLink = `${req.protocol}://${req.get("host")}/api/scouts/verify-email/${token}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: scout.email,
      subject: "Scout Email Verification",
      html: `Please click on the link to verify your email: <a href="${verificationLink}">Verify Email</a>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Verification email sent successfully to ${scout.email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scout Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const scout = await scoutModel.findOne({ email: email.toLowerCase() });
    if (!scout) {
      return res.status(404).json({ message: `Scout with email: ${email} not found.` });
    } else if (!scout.isVerified) {
      return res.status(400).json({ message: `Scout with email: ${email} is not verified.` });
    }
    const isPassword = await bcrypt.compare(password, scout.password);
    if (!isPassword) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const token = await genToken(scout);
    res.status(200).json({ message: "Scout Sign In successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scout Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const scout = await scoutModel.findOne({ email: email.toLowerCase() });
    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }
    const resetToken = await jwt.sign({ scoutId: scout._id }, process.env.JWT_SECRETE, { expiresIn: "30m" });
    const resetLink = `${req.protocol}://${req.get("host")}/api/scouts/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: scout.email,
      subject: "Scout Password Reset",
      html: `Please click on the link to reset your password: <a href="${resetLink}">Reset Password</a>`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scout Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, existingPassword } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
    const scoutId = decodedToken.scoutId;
    const scout = await scoutModel.findById(scoutId);
    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }
    const isPasswordMatch = await bcrypt.compare(existingPassword, scout.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Existing password does not match" });
    }
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);
    scout.password = hashedPassword;
    await scout.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scout Sign Out
const revokedTokens = new Set();
const signOut = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    revokedTokens.add(token);
    res.status(200).json({ message: "Scout signed out successfully" });
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
  revokedTokens
};
