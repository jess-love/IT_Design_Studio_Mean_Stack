let USER_TOKEN = null;

module.exports = {
  getToken: () => USER_TOKEN,
  setToken: (token) => { USER_TOKEN = token; }
};