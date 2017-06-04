// import errors from 'feathers-errors';
import makeDebug from 'debug';
const jwt = require('jsonwebtoken');
const horizon = require('@horizon/server');
const Proto = require('uberproto');
const debug = makeDebug('feathersHorizon');

export default function init (options = {}) {
  debug('Initializing feathersHorizon plugin');
  return function feathersHorizon () {
    const app = this;
    const config = app.get('authentication');
    const rethinkConfig = app.get('rethinkdb');

    const options = {
      project_name: options.token_secret || rethinkConfig.db,
      permissions: options.permissions || false,
      auto_create_index: options.auto_create_index || true,
      auto_create_collection: options.auto_create_collection || true,
      auth: {
        token_secret: options.token_secret || config.secret
      }
    };

    app
      .service('authentication')
      .hooks({
        after: {
          create: [afterCreate]
        }
      });

    app
      .service('users')
      .hooks({
        before: {
          create: [beforeCreateUser]
        }
      });

    Proto.mixin({
      setup (server) {
        horizon(server, options);
        return this
          ._super
          .apply(this, arguments);
      }
    }, app);

    function afterCreate (hook) {
      let id = hook.params.user.id;
      hook.result.hzToken = jwt.sign({
        id,
        provider: null
      }, Buffer.alloc(config.secret, 'base64'), {
        expiresIn: '1h',
        algorithm: 'HS512'
      } // adjust expiration time to taste.
      );
    }

    function beforeCreateUser (hook) {
      if (!hook.data.groups) { hook.data.groups = ['default', 'authenticated']; }
      return hook;
    }
  };
}
