const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const playerModel = require('../models/player');  
const scoutModel = require('../models/scout');       

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true // allows us to access the req in the callback
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Extract email and verification status from profile
      const email = profile.emails?.[0]?.value;
      const isVerified = profile.emails?.[0]?.verified;
      
      if (!email) {
        return done(new Error("Email not provided by Google"), null);
      }
      
      // Determine role from request query (default to 'player' if not specified)
      let role = req.query.role;
      if (!role || (role !== 'player' && role !== 'scout')) {
        role = 'player';
      }
      
      let user;
      
      if (role === 'player') {
        // Look for an existing player by email
        user = await playerModel.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
          // Create a new player record if not found
          user = await playerModel.create({
            fullname: profile.displayName,
            email: email.toLowerCase(),
            password: " ", // placeholder password for OAuth users
            role: 'player',
            isVerified: isVerified
          });
        }
      } else if (role === 'scout') {
        // Look for an existing scout by email
        user = await scoutModel.findOne({ where: { email: email.toLowerCase() } });
        if (!user) {
          // Create a new scout record if not found
          user = await scoutModel.create({
            fullname: profile.displayName, // assuming your Scout model uses 'fullname'
            email: email.toLowerCase(),
            password: " ", // placeholder password for OAuth users
            role: 'scout',
            isVerified: isVerified
          });
        }
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Try to find the user in Players first
    let user = await playerModel.findByPk(id);
    if (!user) {
      // If not found, look in Scouts
      user = await scoutModel.findByPk(id);
    }
    if (!user) {
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
