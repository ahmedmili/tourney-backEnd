const express = require('express');
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');


// Create a function to send an email
const sendEmail = async () => {
  // Create a Nodemailer transporter using your Gmail account
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tourney.mailer@gmail.com',
      pass: 'olcwrxqiossxoxqx' // Replace with your Gmail password or an app-specific password
    },
    tls: {
      rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended for production)
    },
  });

  // Email data
  const mailOptions = {
    from: 'tourney.mailer@gmail.com',
    // to: 'Samaraouadi1999@gmail.com', // Replace with the recipient's email address
    to: 'ahmedmili76@gmail.com', // Replace with the recipient's email address
    subject: 'Test Email',
    text: 'mailing tzadet lel app :D het fech nest7a99o mailing bech nzidhom'
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Define a route to trigger the email sending
router.get('/send-email', (req, res) => {
  sendEmail()
    .then(() => res.send('Email sent!'))
    .catch((err) => 
    {
      console.log(err)
      res.status(500).send('Error sending email.')
    });
});

module.exports = router;