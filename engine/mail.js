const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const config = require("./config");
const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);

OAuth2_client.setCredentials({ refresh_token: config.refreshToken });
function send_mail(name, recipient, link) {
  const accessToken = OAuth2_client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  const options = {
    from: `${config.user}`,
    to: recipient,
    subject: "Password reset link",
    text: getHtmlMsg(name, link),
  };

  transport.sendMail(options, function (err, result) {
    if (err) {
      console.log("Mail not sent", err);
    } else {
      console.log("Mail Sent", result);
    }
    transport.close();
  });
}

function getHtmlMsg(name, link) {
  return `${name}!, Please find the link to reset your password.
  ${link}`;
}

module.exports = send_mail;
// send_mail("Ankit", "ankitraj240aj@gmail.com", "khhbhj");
