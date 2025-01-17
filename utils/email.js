const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) create a transporter - this is what will actually send the email
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      password: process.env.EMAIL_PASSWORD,
    },
  });

  //2) define email options
  const mailOptions = {
    from: 'Elena Haran <hello@elena.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html: we can specify the HTML property or leave it as text
  };

  //3) send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
