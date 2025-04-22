const Joi = require('joi');

// Registration Validation
exports.registerValidation = (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string()
            .min(3)
            .trim()
            .pattern(/^[A-Za-z ]+$/)
            .required()
            .messages({
                'any.required': 'Fullname is required',
                'string.empty': 'Fullname cannot be empty',
                'string.pattern.base': 'Fullname should only contain alphabets',
                'string.min': 'Fullname should not be less than 3 letters'
            }),

        email: Joi.string()
            .email()
            .pattern(/^[a-z0-9](\.?[a-z0-9]){5,}@[a-z0-9-]+\.[a-z]{2,}$/)
            .required()
            .messages({
                'string.email': 'Invalid email format',
                'string.empty': 'Email cannot be empty',
                'any.required': 'Email is required'
                
            }),

        password: Joi.string()
            .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .trim()
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]',
                'any.required': 'Password is required',
                'string.empty': 'Password cannot be empty'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Confirm password is required'
            })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

// Forgot Password Validation
exports.forgetPasswords = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            
            .messages({
                'string.email': 'Invalid email format',
                'string.empty': 'Email cannot be empty',
                'any.required': 'Email is required',
               
            })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

// Login Validation
exports.loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Invalid email format',
                'string.empty': 'Email cannot be empty',
                'any.required': 'Email is required'
            }),

            password: Joi.string()
            .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .trim()
            .required()
            .messages({
                'any.required': 'Password is required',
                'string.empty': 'Password cannot be empty'
            }),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};

exports.resetPasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        newPassword: Joi.string()
            
            .trim()
            .required()
            .messages({
                'string.pattern.base': 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]',
                'any.required': 'Password is required',
                'string.empty': 'Password cannot be empty'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Confirm password is required'
            })    
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
}


// Change Password Validation
exports.changePasswordValidation = (req, res, next) => {
    const schema = Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'any.required': 'Current password is required',
                'string.empty': 'Current password cannot be empty'
            }),

        newPassword: Joi.string()
            .pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
            .trim()
            .required()
            .messages({
                'string.pattern.base': 'New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character',
                'any.required': 'New password is required',
                'string.empty': 'New password cannot be empty'
            }),

        confirmPassword: Joi.string()
            .valid(Joi.ref('newPassword'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Confirm password is required'
            })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map(err => err.message)
        });
    }

    next();
};
