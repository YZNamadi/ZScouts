'use strict';

require('dotenv').config();
const { Scout, ScoutKyc, Player } = require('../models'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {reset} = require('../utils/mailTemplates');
const { verify } = require('../utils/mailTemplates');
const { resendVerifyEmail } = require('../utils/mailTemplates');
const nodemailer = require('nodemailer');


// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  secure: false,
});

// Generate JWT token helper for scouts
const genToken = async (user) => {
  try {
    return await jwt.sign(
      {
        userId: user.id, 
        scoutId: user.scoutId, // Sequelize uses id
        fullname: user.fullname,
        role: user.role,  
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '50m' }
    );
  } catch (error) {
    console.error('Token generation error:', error.message);
    throw error;
  }
};

// Scout Sign Up
const signUp = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword  } = req.body;

    if (!fullname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "fullname, email, and password are required." });
    }
    if(password !== confirmPassword){
      return res.status(400).json({message: "password does not match"})
    }
    
    const existingPlayer = await Player.findOne({ where: { email: email.toLowerCase() } });
    const existingScout = await Scout.findOne({ where: { email: email.toLowerCase() } });

    if (existingPlayer || existingScout) {
      return res.status(400).json({ message: `The email ${email} is already associated with an account. Please use a different email.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '50m' });

    const scout = await Scout.create({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
    });

    const verificationLink =  `https://z-scoutsf.vercel.app/email_verify/${token}`;
    const firstName =scout.fullname.split(' ')[0]; 
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verify Your Scout Account',
      html: verify(verificationLink, firstName)
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: `Check your email: ${scout.email} to verify your scout account.`,
      data: scout,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Scout Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: 'Verification link expired. Please request a new one.' });
    }

    const scout = await Scout.findOne({ where: { email: decoded.email.toLowerCase() } });
    if (!scout) {
      return res.status(404).json({ message: 'Scout not found' });
    }
    if (scout.isVerified) {
      return res.status(400).json({ message: 'Scout already verified' });
    }

    scout.isVerified = true;
    await scout.save();

    res.status(200).json({ message: 'Scout verified successfully', data: scout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend Verification Email for Scout
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const scout = await Scout.findOne({ where: { email: email.toLowerCase() } });

    if (!scout) {
      return res.status(404).json({ message: 'Scout not found' });
    }
    if (scout.isVerified) {
      return res.status(400).json({ message: 'Scout already verified' });
    }

    const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '50m' });
    const resendVerifyLink = `https://z-scoutsf.vercel.app/email_verify/${token}`;
    const firstName = scout.fullname.split(' ')[0]; // Get the first name from the full name
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: scout.email,
      subject: 'Scout Email Verification',
      html: resendVerifyEmail(resendVerifyLink, firstName),
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: `Verification email sent successfully to ${scout.email}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find scout by email
    const scout = await Scout.findOne({ where: { email: email.toLowerCase() } });
    if (!scout) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, scout.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: scout.id,
        fullname: scout.fullname,
        email: scout.email,
        role: "scout"
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and scout data
    res.status(200).json({
      message: "Login successful",
      token,
      data: {
        id: scout.id,
        fullname: scout.fullname,
        email: scout.email,
        role: "scout"
      }
    });

  } catch (error) {
    console.error("Scout SignIn Error:", error.message);
    res.status(500).json({ message: "Error logging in: " + error.message });
  }
};

// Forgot Pass
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const scout = await Scout.findOne({ where: { email: email.toLowerCase() } });

    if (!scout) {
      return res.status(404).json({ message: 'Scout not found' });
    }

    // Generate the reset token
    const resetToken = await jwt.sign({ scoutId: scout.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    const resetLink = `https://z-scoutsf.vercel.app/reset_password/${resetToken}`;
    const firstName = scout.fullname.split(' ')[0]; // Get the first name from the full name
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: scout.email,
      subject: 'Scout Password Reset',
      html: reset(resetLink, firstName)
      ,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Pass
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

  
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Both password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Decode and verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const message = err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token';
      return res.status(400).json({ message });
    }

    // Find user
    const scout = await Scout.findOne({ where: { id: decoded.userId } });
    if (!scout) {
      return res.status(404).json({ message: 'Scout not found' });
    }

    // Hash and save new password
    scout.password = await bcrypt.hash(newPassword, 10);
    await scout.save();

    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const scout = await Scout.findOne({ where: { id: req.userId } });

    if (!scout) {
      return res.status(404).json({ message: 'Scout not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, scout.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    scout.password = await bcrypt.hash(newPassword, 10);
    await scout.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scout Sign Out
const revokedTokens = new Set();

const signOut = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    revokedTokens.add(token); // Add the token to the blacklist

    res.status(200).json({ message: "Scout signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getScout = async (req, res) => {
  try {
    const {id} = req.params;

    const findScout = await Scout.findOne({
      where: { id },
      include: [{ model: ScoutKyc, as: 'scoutKyc' }]
    });
    
    if(!findScout){
     return res.status(400).json({
        message:"Scout not found"
      })
    }else{
      res.status(200).json({
        message:"Scout found",
        data: findScout
      })
    }

  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Internal Sever Error"
    })
  }
};



module.exports = {
  signUp,
  verifyEmail,
  resendVerificationEmail,
  signIn,
  forgotPassword,
  resetPassword,
  changePassword,
  signOut,
  getScout
};
