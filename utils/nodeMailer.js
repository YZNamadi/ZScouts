require('dotenv').config();
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

const sendMail = async (options) => {
  try {
    if (!options.email) {
      throw new Error('Recipient email is required.');
    }

    // Create the transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject || 'No Subject',
      text: options.text || '',
      html: options.html || '',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}: ${info.response}`);

    // Save email details to MySQL
    const sql = `INSERT INTO emails (recipient, subject, message, status, sent_at) VALUES (?, ?, ?, ?, NOW())`;
    await db.execute(sql, [
      options.email,
      options.subject || 'No Subject',
      options.html || options.text || '',
      'sent',
    ]);

    return info;
  } catch (error) {
    console.error(' Error sending email:', error.message);

    // Log failed email to MySQL
    const sql = `INSERT INTO emails (recipient, subject, message, status, sent_at) VALUES (?, ?, ?, ?, NOW())`;
    await db.execute(sql, [
      options.email || 'unknown',
      options.subject || 'No Subject',
      options.html || options.text || '',
      'failed',
    ]);

    throw error;
  }
};

module.exports = sendMail;
