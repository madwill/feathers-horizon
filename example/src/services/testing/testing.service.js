// Initializes the `testing` service on path `/testing`
const createService = require('feathers-rethinkdb');
const hooks = require('./testing.hooks');
const filters = require('./testing.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'testing',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/testing', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('testing');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
