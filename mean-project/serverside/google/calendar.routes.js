const express = require('express');
const router = express.Router();
const oauth2Client = require('./google-auth.js');
const tokenStore = require('./token-store.js');

console.log("Calendar Routes Loaded");

router.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
    response_type: 'code'
  });

  res.redirect(url);
});

router.get('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    if (tokens.refresh_token) {
      tokenStore.setToken(tokens.refresh_token);
    }

    res.send("Google Calendar Connected! You can close this window.");
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.status(500).send("Authentication failed.");
  }
});

module.exports = router;