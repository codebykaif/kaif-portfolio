// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*' // set origin in production
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configure transporter using SMTP credentials from .env
// For Gmail, use an App Password (requires 2FA). Do NOT use plain account password.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: (process.env.SMTP_SECURE === 'true') || true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verify transporter
transporter.verify().then(() => {
  console.log('Mail transporter ready');
}).catch(err => {
  console.error('Transporter error', err);
});

app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, message } = req.body || {};

    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const mailOptions = {
  from: `"${fullName}" <${process.env.EMAIL_USER}>`,
  to: process.env.RECEIVER_EMAIL,  // receiver from .env
  replyTo: email,                  // reply goes to client
  subject: `Portfolio Contact: ${fullName}`,
  text: `Name: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`,
  html: `
    <h3>New message from portfolio contact form</h3>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g,'<br>')}</p>
  `
};


    await transporter.sendMail(mailOptions);
    return res.json({ ok: true, message: 'Email sent' });
  } catch (err) {
    console.error('Send error', err);
    return res.status(500).json({ error: 'Unable to send email' });
  }
});

require('dotenv').config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
console.log('RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
