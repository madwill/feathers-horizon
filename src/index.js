const jwt = require('jsonwebtoken');
const horizon = require('@horizon/server');
const Proto = require('uberproto');

function init (options) {
  return function feathersHorizon () {
    const app = this;
    const config = app.get('authentication');
    const rethinkConfig = app.get('rethinkdb');

    const horizonOptions = {
      project_name: rethinkConfig.db,
      permissions: false,
      auto_create_index: true,
      auto_create_collection: true,
      auth: {
        token_secret: config.secret
      }
    };

    Proto.mixin({
      setup (server) {
        this.horizonServer = horizon(server, horizonOptions);
        return this
          ._super
          .apply(this, arguments);
      }
    }, app);

    this.setHooks = (app) => {
      const authService = app.service('authentication');
      if (authService) {
        authService.hooks({
          after: {
            create: [this.authenticationAfterCreate]
          }
        });
      }

      const userService = app.service('users');
      if (userService) {
        userService.hooks({
          before: {
            create: [this.usersBeforeCreate]
          }
        });
      }
    };

    this.authenticationAfterCreate = (hook) => {
      let id = hook.params.user.id;
      hook.result.hzToken = jwt.sign({
        id,
        provider: null
      }, Buffer.alloc(config.secret, 'base64'), {
        expiresIn: '1h',
        algorithm: 'HS512'
      } // adjust expiration time to taste.
      );
    };

    this.usersBeforeCreate = (hook) => {
      if (!hook.data.groups) {
        hook.data.groups = ['default', 'authenticated'];
      }
      return hook;
    };

    this.setHooks(app);
  };
}

module.exports = init;
