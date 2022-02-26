const nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "KadyanAmrita112233@gmail.com",
    pass: "Amrita@5915",
  },
});

module.exports.sendResetEmail = async (email, token) => {
   // change first part to your domain
  var url = "http://localhost:8000/user/reset-password?token=" + token;

  await smtpTransport.sendMail({
    from: "<your email>",
    to: email,
    subject: "RESET YOUR PASSWORD",
    text: `Click on this link to reset your password ${url}`,
    html: `<h3> Click on this link to reset your password : ${url} </h3>`,
  });
};

module.exports.sendVerifyEmail = async (email, token) => {
  // change first part to your domain
  var url = "http://localhost:8000/user/verifyemail?token=" + token;

  await smtpTransport.sendMail({
    from: "<your email>",
    to: email,
    subject: "VERIFY Your EMAIL",
    text: `Click on this link to verify ${url}`,
    html: `<h3> Click on this link to verify your email : ${url} </h3>`,
  });
};