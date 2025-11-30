const { google } = require('googleapis');
const oauth2Client = require('./google-auth');
const tokenStore = require('./token-store');

const calendar = google.calendar({ version: 'v3' });

async function getAuthorizedClient(refreshToken) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { token } = await oauth2Client.getAccessToken();

  oauth2Client.setCredentials({
    access_token: token,
    refresh_token: refreshToken
  });

  return oauth2Client;
}

module.exports = {
  createEvent: async (refreshToken, eventDetails) => {
    const auth = await getAuthorizedClient(refreshToken);

    const response = await calendar.events.insert({
      auth,
      calendarId: 'primary',
      resource: eventDetails,
    });

    return response.data.id;
  },

  updateEvent: async (refreshToken, eventId, eventDetails) => {
    const auth = await getAuthorizedClient(refreshToken);

    await calendar.events.update({
      auth,
      calendarId: 'primary',
      eventId,
      resource: eventDetails,
    });
  },

  deleteEvent: async (refreshToken, eventId) => {
    const auth = await getAuthorizedClient(refreshToken);

    await calendar.events.delete({
      auth,
      calendarId: 'primary',
      eventId,
    });
  }
};