const jwt = require('jsonwebtoken');
const horizon = require('@horizon/server');
const Proto = require('uberproto');

function init (options = {auth: {}}) {
  return function feathersHorizon () {
    const app = this;
    const config = app.get('authentication');
    const rethinkConfig = app.get('rethinkdb');

    const horizonOptions = {
      project_name: options.project_name || rethinkConfig.db || 'horizon',
      rdb_host: options.rdb_host || 'localhost',
      rdb_port: options.rdb_port || 28015,
      permissions: options.permissions || false,
      path: options.path || '/horizon',
      auto_create_index: options.auto_create_index || true,
      auto_create_collection: options.auto_create_collection || true,
      auth: {
        token_secret: options.auth.token_secret || config.secret,
        allow_anonymous: options.auth.token_secret || false,
        allow_unauthenticated: options.auth.allow_unauthenticated || false,
        new_user_group: options.auth.new_user_group || 'authenticated',
        duration: options.auth.new_user_group || '1d'
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
      }, Buffer.from(config.secret, 'base64'), {
        expiresIn: horizonOptions.auth.duration,
        algorithm: 'HS512'
      });
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
