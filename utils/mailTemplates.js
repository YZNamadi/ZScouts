const newBaseStyles = `
    <style>
        /* Global reset */
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        /* Body Styles */
        body.email_body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #f3f4f6 0%, #e4e7eb 100%);
            color: #333;
            width: 100%;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        /* Email container */
        .email_wrapper {
            width: 100%;
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            padding: 40px 30px;
            text-align: center;
            border-top: 5px solid #6FD82B;
        }

        /* Logo */
        .app_logo img {
            width: 140px;
            margin-bottom: 20px;
        }

        /* Heading */
        .user_name h4 {
            font-size: 24px;
            font-weight: 600;
            color: #07232F;
            margin-bottom: 15px;
        }

        /* Content */
        .wrapper_content h3 {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 20px;
            color: #555;
        }

        .wrapper_content p {
            font-size: 16px;
            color: #777;
            margin-bottom: 20px;
        }

        /* Action button */
        .action-button {
            display: inline-block;
            padding: 15px 30px;
            background-color: #6FD82B;
            color: #fff;
            text-decoration: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .action-button:hover {
            background-color: #5a9e24;
            transform: translateY(-2px);
        }

        /* Footer */
        .wrapper_footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
            border-top: 1px solid #f0f0f0;
            padding-top: 15px;
        }

        .wrapper_footer p {
            font-size: 14px;
        }

        .wrapper_footer a {
            color: #6FD82B;
            text-decoration: none;
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
            .email_wrapper {
                padding: 30px 20px;
            }

            .app_logo img {
                width: 120px;
            }

            .user_name h4 {
                font-size: 20px;
            }

            .action-button {
                padding: 12px 25px;
                font-size: 15px;
            }
        }
    </style>
`;

function newBaseTemplate(content, title, firstName, customFooterText = null) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        ${newBaseStyles}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body class="email_body">
        <div class="email_wrapper">
            <div class="app_logo">
                <img src="https://res.cloudinary.com/dihonf8ai/image/upload/v1744908308/logo_ysyv7k.png" 
                     alt="ZScouts Football Platform" 
                     title="ZScouts - Your Football Journey Starts Here">
            </div>
            <div class="user_name">
                <h4>Hello ${firstName},</h4>
            </div>
            ${content}
            <div class="wrapper_footer">
                <p>${customFooterText || "If you didn't request this, feel free to ignore this email."}</p>
                <p><a href="https://zscouts.com/support">Contact Support</a></p>
                <p>&copy; ${new Date().getFullYear()} ZScouts. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Password Reset Email
exports.reset = (resetLink, firstName) => {
    const content = `
        <div class="wrapper_content">
            <h3>Forgot your password? No problem!</h3>
            <p>Click below to reset your password and get back to your football journey:</p>
            <a href="${resetLink}" class="action-button" target="_blank" rel="noopener noreferrer">Reset Password</a>
            <p><small><strong>Note:</strong> This link expires in 24 hours.</small></p>
        </div>
    `;
    return newBaseTemplate(content, "ZScouts Password Reset", firstName);
};

// Email Verification
exports.verify = (verificationLink, firstName) => {
    const content = `
        <div class="wrapper_content">
            <h3>Welcome to ZScouts! 🌟</h3>
            <p>To complete your registration, we just need to verify your email:</p>
            <a href="${verificationLink}" class="action-button" target="_blank" rel="noopener noreferrer">Verify Email</a>
        </div>
    `;
    return newBaseTemplate(content, "Verify Your ZScouts Account", firstName);
};

// Resend Verification Email
exports.resendVerifyEmail = (resendVerifyLink, firstName) => {
    const content = `
        <div class="wrapper_content">
            <h3>We're waiting for you! 🎯</h3>
            <p>Click below to verify your email and get started with ZScouts:</p>
            <a href="${resendVerifyLink}" class="action-button" target="_blank" rel="noopener noreferrer">Complete Verification</a>
        </div>
    `;
    const footerText = "If you didn't sign up for ZScouts, you can ignore this email.";
    return newBaseTemplate(content, "Complete Your ZScouts Registration", firstName, footerText);
};
