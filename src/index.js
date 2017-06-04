// import errors from 'feathers-errors';
import makeDebug from 'debug';
import Proto from 'uberproto';
import jwt from 'jsonwebtoken';
import horizon from '@horizon/server';
const debug = makeDebug('feathersHorizon');

class Service {
  constructor (options) {
    this.jwtToken_expiresIn = options.jwtToken_expiresIn || '8h';
    this.options = options;
  }

  init (opts = {}) {
    debug('Initializing feathersHorizon plugin');
  }

  extend (obj) {
    return Proto.extend(obj, this);
  }

  setup (app) {
    this.setHooks(app);
    this.startHorizonServer(app);
  }

  setHooks (app) {
    app
      .service('authentication')
      .hooks({
        after: {
          create: [this.authenticationAfterCreate]
        }
      });

    app
      .service('users')
      .hooks({
        before: {
          create: [this.usersBeforeCreate]
        }
      });
  }

  authenticationAfterCreate (hook) {
    let id = hook.params.user.id;
    hook.result.hzToken = jwt.sign({
      id,
      provider: null
    }, Buffer.alloc(this.secret, 'base64'), {
      expiresIn: this.jwtToken_expiresIn || '8h',
      algorithm: 'HS512'
    } // adjust expiration time to taste.
    );
    return hook;
  }

  usersBeforeCreate (hook) {
    if (!hook.data.groups) {
      hook.data.groups = ['default', 'authenticated'];
    }
    return hook;
  }

  startHorizonServer (app) {
    const config = app.get('authentication');
    const rethinkConfig = app.get('rethinkdb');

    this.secret = this.options.token_secret || config.secret;

    const horizonOptions = {
      project_name: this.options.token_secret || rethinkConfig.db,
      permissions: this.options.permissions || false,
      auto_create_index: this.options.auto_create_index || true,
      auto_create_collection: this.options.auto_create_collection || true,
      auth: {
        token_secret: this.secret
      }
    };

    this.horizonServer = horizon(app, horizonOptions);

    return this.horizonServer;
  }

  closeHorizonServer () {
    return this.horizonServer.close();
  }
}

export default function init (options = {}) {
  return new Service(options);
}

init.Service = Service;
