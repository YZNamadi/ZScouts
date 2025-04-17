exports.reset = (resetLink, fullname) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ZScouts Email Verification</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            body.email_body {
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(45deg, rgba(105, 210, 46, 0.1), rgba(0, 51, 17, 0.2)), url('https://www.transparenttextures.com/patterns/waves.png');
                background-size: cover;
                font-family: 'Arial', sans-serif;
            }

            .email_wrapper {
                width: 90%;
                max-width: 600px;
                background-color: #fff;
                border-radius: 12px;
                box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                padding: 40px;
                text-align: center;
                position: relative;
                z-index: 10;
            }

            .email_wrapper::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('https://www.transparenttextures.com/patterns/swirly-lines.png');
                background-size: cover;
                opacity: 0.15;
                z-index: -1;
            }

            .app_logo img {
                width: 120px;
                margin-bottom: 30px;
            }

            .user_name {
                font-size: 22px;
                font-weight: 700;
                color: #1a2d41;
                margin-bottom: 20px;
            }

            .wrapper_content h3 {
                font-size: 18px;
                color: #333;
                line-height: 1.6;
                margin-bottom: 30px;
            }

            .verify {
                display: inline-block;
                padding: 12px 25px;
                background-color: #6FD82B;
                color: #fff;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }

            .verify:hover {
                background-color: #5a9e24;
            }

            .wrapper_footer {
                margin-top: 40px;
                text-align: center;
                color: #999;
            }

            .wrapper_footer p {
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 10px;
            }

            .wrapper_footer h4 {
                font-size: 16px;
                font-weight: 700;
                color: #07232F;
            }
        </style>
    </head>
    <body class="email_body">
        <div class="email_wrapper">
            <div class="app_logo">
                <img src="https://res.cloudinary.com/dihonf8ai/image/upload/v1744908308/logo_ysyv7k.png" alt="ZScouts Logo" />
            </div>
            <div class="user_name">
                <h4>${fullname}</h4>
            </div>
            <div class="wrapper_content">
                <h3>Forgot your password😱? No worries!!</h3>
                <h3>Click the button below to set a new one and get back in the game:</h3>
                <a href="${resetLink}" class="reset" target="_blank" rel="noopener noreferrer">Reset Password</a>
            </div>
            <div class="wrapper_footer">
                <p>If you didn’t initiate please ignore this email.</p>
                <h4>The ZScouts Team</h4>
                &copy; ${new Date().getFullYear()} ZScouts. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};



exports.verify = (verificationLink, fullname) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ZScouts Email Verification</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            body.email_body {
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(45deg, rgba(105, 210, 46, 0.1), rgba(0, 51, 17, 0.2)), url('https://www.transparenttextures.com/patterns/waves.png');
                background-size: cover;
                font-family: 'Arial', sans-serif;
            }

            .email_wrapper {
                width: 90%;
                max-width: 600px;
                background-color: #fff;
                border-radius: 12px;
                box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                padding: 40px;
                text-align: center;
                position: relative;
                z-index: 10;
            }

            .email_wrapper::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('https://www.transparenttextures.com/patterns/swirly-lines.png');
                background-size: cover;
                opacity: 0.15;
                z-index: -1;
            }

            .app_logo img {
                width: 120px;
                margin-bottom: 30px;
            }

            .user_name {
                font-size: 22px;
                font-weight: 700;
                color: #1a2d41;
                margin-bottom: 20px;
            }

            .wrapper_content h3 {
                font-size: 18px;
                color: #333;
                line-height: 1.6;
                margin-bottom: 30px;
            }

            .verify {
                display: inline-block;
                padding: 12px 25px;
                background-color: #6FD82B;
                color: #fff;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }

            .verify:hover {
                background-color: #5a9e24;
            }

            .wrapper_footer {
                margin-top: 40px;
                text-align: center;
                color: #999;
            }

            .wrapper_footer p {
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 10px;
            }

            .wrapper_footer h4 {
                font-size: 16px;
                font-weight: 700;
                color: #07232F;
            }
        </style>
    </head>
    <body class="email_body">
        <div class="email_wrapper">
            <div class="app_logo">
                <img src="https://res.cloudinary.com/dihonf8ai/image/upload/v1744908308/logo_ysyv7k.png" alt="ZScouts Logo" />
            </div>
            <div class="user_name">
                <h4>${fullname}</h4>
            </div>
            <div class="wrapper_content">
                <h3>Welcome to ZScouts! You’re just one step away from unlocking your football journey.</h3>
                <h3>Click the button below to verify your email and activate your account:</h3>
                <a href="${verificationLink}" class="verify" target="_blank" rel="noopener noreferrer">Verify Your Account</a>
            </div>
            <div class="wrapper_footer">
                <p>If you didn’t sign up for ZScouts, please ignore this email.</p>
                <h4>The ZScouts Team</h4>
                &copy; ${new Date().getFullYear()} ZScouts. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};


exports.resendVerifyEmail = (resendVerifyLink, fullname) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ZScouts Email Verification</title>
        <style>
            * {
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }

            body.email_body {
                width: 100%;
                height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(45deg, rgba(105, 210, 46, 0.1), rgba(0, 51, 17, 0.2)), url('https://www.transparenttextures.com/patterns/waves.png');
                background-size: cover;
                font-family: 'Arial', sans-serif;
            }

            .email_wrapper {
                width: 90%;
                max-width: 600px;
                background-color: #fff;
                border-radius: 12px;
                box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                padding: 40px;
                text-align: center;
                position: relative;
                z-index: 10;
            }

            .email_wrapper::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('https://www.transparenttextures.com/patterns/swirly-lines.png');
                background-size: cover;
                opacity: 0.15;
                z-index: -1;
            }

            .app_logo img {
                width: 120px;
                margin-bottom: 30px;
            }

            .user_name {
                font-size: 22px;
                font-weight: 700;
                color: #1a2d41;
                margin-bottom: 20px;
            }

            .wrapper_content h3 {
                font-size: 18px;
                color: #333;
                line-height: 1.6;
                margin-bottom: 30px;
            }

            .verify {
                display: inline-block;
                padding: 12px 25px;
                background-color: #6FD82B;
                color: #fff;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                border-radius: 8px;
                transition: background-color 0.3s ease;
            }

            .verify:hover {
                background-color: #5a9e24;
            }

            .wrapper_footer {
                margin-top: 40px;
                text-align: center;
                color: #999;
            }

            .wrapper_footer p {
                font-size: 14px;
                line-height: 1.6;
                margin-bottom: 10px;
            }

            .wrapper_footer h4 {
                font-size: 16px;
                font-weight: 700;
                color: #07232F;
            }
        </style>
    </head>
    <body class="email_body">
        <div class="email_wrapper">
            <div class="app_logo">
                <img src="https://res.cloudinary.com/dihonf8ai/image/upload/v1744908308/logo_ysyv7k.png" alt="ZScouts Logo" />
            </div>
            <div class="user_name">
                <h4>${fullname}</h4>
            </div>
            <div class="wrapper_content">
                <h3>Welcome to ZScouts!</h3>
                <h3>Click the button below to re-verify your email and activate your account:</h3>
                <a href="${resendVerifyLink}" class="verify" target="_blank" rel="noopener noreferrer">re-verify Your Account</a>
            </div>
            <div class="wrapper_footer">
                <p>If you didn’t sign up for ZScouts, please ignore this email.</p>
                <h4>The ZScouts Team</h4>
                &copy; ${new Date().getFullYear()} ZScouts. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};
