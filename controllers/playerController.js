'use strict';

require('dotenv').config();
const { Player, PlayerKyc, Scout, Video, Rating} = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const emailTemplate = require("../utils/signup");
const {reset} = require('../utils/mailTemplates');
const  {verify}  = require('../utils/mailTemplates');
const {resendVerifyEmail} = require('../utils/mailTemplates');
const { Op } = require("sequelize");
const player = require('../models/player');



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
      role: user.role,
      fullname: user.fullname,
      email: user.email,
      isAdmin: user.isAdmin

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
    const existingScout = await Scout.findOne({ where: { email: email.toLowerCase() } });

    if (existingPlayer || existingScout) {
      return res.status(400).json({ message: `The email ${email} is already associated with an account. Please use a different email.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "50m" });

    const player = await Player.create({
      fullname,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false
    });

    const verificationLink =`https://z-scoutsf.vercel.app/email_verify_player/${token}`;
    const firstName =player.fullname.split(" ")[0];
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your Player account",
      html: verify(verificationLink, firstName)
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

    const resendVerifyLink = `https://z-scoutsf.vercel.app/email_verify_player${token}`;
    const firstName = player.fullname.split(" ")[0];
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: player.email,
      subject: "Resend Player Verification",
      html: resendVerifyEmail(resendVerifyLink, firstName)
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

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const player = await Player.findOne({ where: { email: email.toLowerCase() } });
    if (!player) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, player.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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

    const resetLink = `https://z-scoutsf.vercel.app/reset_password_players${resetToken}`;
    const firstName = player.fullname.split(" ")[0];
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: player.email,
      subject: "Player Password Reset",
      html:reset(resetLink, firstName)
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
    const { newPassword, confirmPassword } = req.body;

    const decoded= jwt.verify(token, process.env.JWT_SECRET);

    const player = await Player.findOne({ where: { id: decoded.userId } });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    player.password = hashedPassword;
    await player.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//  Change Password
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const playerId = req.user.userId;

    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, player.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    player.password = hashedPassword;
    await player.save();

    res.status(200).json({ message: "Password changed successfully" });
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
    revokedTokens.add(token);

    res.status(200).json({ message: "Player signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlayerContact = async (req, res) => {
  try {
    const { playerId } = req.params;
    const requestingPlayerId = req.user.id;

    // Check if the player has paid
    const transaction = await Transaction.findOne({
      where: {
        playerId: requestingPlayerId,
        contactedPlayerId: playerId,
        status: 'completed',
      },
    });

    if (!transaction) {
      return res.status(403).json({
        success: false,
        message: 'You must pay before accessing this player’s contact details.',
      });
    }

    // Get player details and ratings
    const player = await Player.findByPk(playerId, {
      attributes: ['email', 'phone', 'address'],
      include: [
        {
          model: Rating,
          attributes: ['score'],
        },
      ],
    });

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found.',
      });
    }

    // Calculate average rating
    const ratings = player.Ratings || [];
    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
    const averageRating = ratings.length > 0 ? (totalScore / ratings.length).toFixed(1) : 'No ratings yet';

    res.status(200).json({
      success: true,
      message: 'Player contact retrieved successfully.',
      contact: {
        email: player.email,
        phone: player.phone,
        address: player.address,
      },
      averageRating,
    });
  } catch (error) {
    console.error('Error fetching player contact:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
};


const getPlayer = async (req, res) => {
  try {
    const {id} = req.params;

    const findPlayer = await Player.findOne({
      where: { id },
      include: [{ model: PlayerKyc, as: 'playerKyc', }, { model: Rating, as: 'ratings', }]
    });
    
    if(!findPlayer){
     return res.status(400).json({
        message:"Player not found"
      })
    }else{
      res.status(200).json({
        message:"Player found",
        data: findPlayer
      })
    }

  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Internal Sever Error"
    })
  }
};

const positionSearch = async (req, res) => {
  try {
    const { primaryPosition } = req.body;

    const players = await Player.findAll({
      attributes: ['fullname'],
      include: [
        {
          model: PlayerKyc,
          as: 'playerKyc',
          where: { primaryPosition },
          attributes: {
            exclude: ['id', 'playerId']
          }
        }
      ]
    });

    res.status(200).json({
      message: `Players with primary position: ${primaryPosition}`,
      data: players
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const footSearch = async (req, res) => {
  try {
    const { preferredFoot } = req.body;

    const players = await Player.findAll({
      attributes: ['fullname'],
      include: [
        {
          model: PlayerKyc,
          as: 'playerKyc',
          where: { preferredFoot },
          attributes: {
            exclude: ['id', 'playerId']
          }
        }
      ]
    });

    res.status(200).json({
      message: `${preferredFoot} footed players `,
      data: players
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllVideosByPlayer = async (req, res) => {
  try {
    console.log("Here");
    
    const { id } = req.params;
    
    const player = await Player.findByPk(id);
    console.log("Player:", player);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const playerVideos = await Video.findAll({
      where: { playerId: id }
    });

    if (!playerVideos) {
      return res.status(404).json({ message: "Player Videos not found" });
    }

    res.status(200).json({
      message: `All of video of player`,
      data: playerVideos
    });

  } catch (error) {
    console.log(error.message)
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getOneVideoOfPlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await Player.findOne({ where: { id } });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const playerKyc = await PlayerKyc.findOne({
      where: { playerId: id },
      attributes: ['media']
    });

    if (!playerKyc) {
      return res.status(404).json({ message: "video of player not found" });
    }

    res.status(200).json({
      message: "video of player retrived successfully",
      data: playerKyc
    });

  } catch (error) {
    console.log(error.message)
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPlayers = async (req, res) => {
  try {
    const allPlayers = await Player.findAll({
      include: [
        {
          model: PlayerKyc,
          as: 'playerKyc',
        },
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: Scout,
              as: 'scout', // Make sure this alias matches your association
              attributes: ['id', 'fullname', 'email'] // Optional: limits the fields returned
            }
          ]
        }
      ]
    });

    res.status(200).json({
      message: "All players in database",
      data: allPlayers,
      total: allPlayers.length
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
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
  searchPlayers,
  getPlayerContact,
  getPlayer,
  positionSearch,
  footSearch,
getAllVideosByPlayer,
getOneVideoOfPlayer,
getAllPlayers
};
