const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports = sendEmail;

async function sendEmail({ to, subject, html, from = config.emailFrom }) {
  console.log('SMTP Options:', config.smtpOptions);  // Log the smtpOptions to check if they are loaded correctly

  try {
    const transporter = nodemailer.createTransport(config.smtpOptions);
    console.log('Transporter created successfully'); // Ensure transporter is created without issue

    const info = await transporter.sendMail({ from, to, subject, html });
    console.log('Email sent:', info);  // Log the email send result
  } catch (error) {
    console.error('Error sending email:', error); // Log any error encountered during email sending
    throw new Error('Failed to send email');
  }
}
