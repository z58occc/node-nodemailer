const { error } = require("console");
var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Express",
    errors: req.flash("errors"),
  });
});

router.post("/user/send", (req, res) => {
  if (req.body.username == "") {
    req.flash("errors", "姓名不可為空");
    res.redirect("/");
  }
  const { refresh_token, access_token } = req.session.tokens;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "a0981583030@gmail.com",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: refresh_token,
      accessToken: access_token,
    },
  });

  const mailOptions = {
    from: req.body.username,
    to: "a0981583030@gmail.com",
    subject: req.body.title,
    text: req.body.description,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error sending email");
    } else {
      console.log(info);
      res.send("Email sent");
    }
  });
});

module.exports = router;
