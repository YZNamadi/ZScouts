const User = require("../models/user");
const jwt = require('jsonwebtoken');

exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization?.split(' ')[1];
        if (!auth) {
            return res.status(401).json({
                message: "Token not found"
            })
        }
        const payload = await jwt.verify(auth, process.env.JWT_SECRET, (error, payload) => {
            if (error) {
                return res.status(401).json({
                    message: 'Session expired'
                })
            } else {
                return payload
            }
        });
        const user = await User.findByPk(payload.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            })
        };

        req.user = payload;

        next();

    } catch (error) {
        return res.status(500).json({ message: 'Error authenticating user: ' + error.message })
    }
}
