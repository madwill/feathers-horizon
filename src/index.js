// import errors from 'feathers-errors';
import makeDebug from 'debug';
const jwt = require('jsonwebtoken');
const horizon = require('@horizon/server');
const Proto = require('uberproto');
const debug = makeDebug('feathers-horizon');

export default function init(options = {}) {
  debug('Initializing feathers-horizon plugin');
  return function feathersHorizon() {
    const app = this;
    const _super = app.setup;
    const config = app.get('authentication');
    const rethinkConfig = app.get('rethinkdb');

    const options = {
      project_name: rethinkConfig.db,
      permissions: false,
      auto_create_index: true,
      auto_create_collection: true,
      auth: {
        token_secret: config.secret
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
      setup(server) {
        const horizonServer = horizon(server, options);
        return this
          ._super
          .apply(this, arguments);
      }
    }, app);

    function afterCreate(hook) {
      let id = hook.params.user.id;
      hook.result.hzToken = jwt.sign({
        id,
        provider: null
      }, new Buffer(config.secret, 'base64'), {
        expiresIn: '1h',
        algorithm: 'HS512'
      } // adjust expiration time to taste.
      );
    }

    function beforeCreateUser(hook) {
      if (!hook.data.groups) 
        hook.data.groups = ['default', 'authenticated'];
      return hook;
    }
  }
}
