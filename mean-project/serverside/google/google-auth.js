const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  "1081266735348-31omffhqt27rsosejv0d50fgt6mmq0or.apps.googleusercontent.com",
  "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",
  "http://localhost:3000/auth/google/callback"
);

module.exports = oauth2Client;