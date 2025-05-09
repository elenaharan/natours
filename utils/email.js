const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Elena Haran <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  //send the actual email
  send(template, subject) {
    // 1) render html based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../../views/emails/${template}.pug`,
    );

    // 2) define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: options.message,
      //html: we can specify the HTML property or leave it as text
    };

    //3) create transport & send email
  }

  sendWelcome() {
    this.send('welcome', 'Welcome to the Natours Family!');
  }
};

const sendEmail = async (options) => {
  //send email
  await transporter.sendMail(mailOptions);
};
