const nodemailer = require('nodemailer');

// Create a function to send an email
const sendEmail = async (data) => {
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
    to: data.to,
    subject: data.subject,
    text: data.body
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// export default sendEmail;
module.exports = {
  sendEmail
}

// Define a route to trigger the email sending
// router.post('/send-email', (req, res) => {
//   const body = req.body
//   const mailInfo = {
//     to:body.to,
//     subject:body.subject,
//     text:body.text,
//   }
//   sendEmail(mailInfo)
//     .then(() => res.send('Email sent!'))
//     .catch((err) => {
//       console.log(err)
//       res.status(500).send('Error sending email.')
//     });
// });

// module.exports = router;