var express = require("express");
var router = express.Router();

const googleOAuth2Client = require("../config/googleOAuth2Client");

const SCOPES = ["https://mail.google.com/"];

router.get("/login", (req, res) => {
  const authUrl = googleOAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await googleOAuth2Client.getToken(code);

    googleOAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;
    res.redirect("/email/user");
  } catch (err) {
    console.error("Error authenticating with Google:", err);
    res.status(500).send("Error authenticating with Google");
  }
});

module.exports = router;
