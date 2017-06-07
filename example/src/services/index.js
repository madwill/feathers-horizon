const users = require('./users/users.service.js');
const testing = require('./testing/testing.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(testing);
};
