const html = (verifyLink, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ZScouts Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9fafb;
                margin: 0;
                padding: 0;
                color: #1a202c;
            }
            .container {
                width: 90%;
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            .header {
                background-color: #0f172a;
                padding: 20px;
                text-align: center;
                color: #ffffff;
                font-size: 24px;
                font-weight: bold;
            }
            .content {
                padding: 30px;
                text-align: center;
            }
            .content h2 {
                margin-bottom: 10px;
            }
            .content p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }
            .button {
                display: inline-block;
                background-color: #2563eb;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                font-size: 16px;
                border-radius: 6px;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #1e40af;
            }
            .footer {
                padding: 20px;
                font-size: 13px;
                text-align: center;
                color: #718096;
                background-color: #f1f5f9;
            }
            .link {
                color: #2563eb;
                word-break: break-word;
                text-decoration: none;
            }
            .link:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Welcome to ZScouts!
            </div>
            <div class="content">
                <h2>Hello ${firstName},</h2>
                <p>We're excited to have you on board! Please verify your email address to activate your ZScouts account and join the movement to discover football talent.</p>
                <a href="${verifyLink}" class="button">Verify My Account</a>
                <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                <p><a href="${verifyLink}" class="link">${verifyLink}</a></p>
                <p>If you didn’t request this, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} ZScouts. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
  };
  
  module.exports = html;
  