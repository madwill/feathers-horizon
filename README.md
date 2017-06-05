# feathers-horizon

[![Build Status](https://travis-ci.org/madwill/feathers-horizon.svg?branch=master)](https://travis-ci.org/madwill/feathers-horizon)
<a href="https://codeclimate.com/github/madwill/feathers-horizon"><img src="https://codeclimate.com/github/madwill/feathers-horizon/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/madwill/feathers-horizon/coverage"><img src="https://codeclimate.com/github/madwill/feathers-horizon/badges/coverage.svg" /></a>
[![GitHub issues](https://img.shields.io/github/issues/madwill/feathers-horizon.svg?style=flat-square)](https://github.com/madwill/feathers-horizon/issues)
[![Download Status](https://img.shields.io/npm/dm/feathers-horizon.svg?style=flat-square)](https://www.npmjs.com/package/feathers-horizon)

> Horizon.js feathers plugin, this plugin will start an horizon server instance using provided options or defaults feathers config. 

##Goals

Plugins intent to add missing horizon.js functionality by leveraging the excellent featherjs for backend. It uses feathers authentication for local strategy 

This grants you the entire [featherjs ecosystem](https://github.com/feathersjs/feathers-docs/tree/master/ecosystem) around your horizon.js application

## Installation

```
npm install feathers-horizon --save
``` 

## Create your app using feathers generators

```
feathers generate app
feathers generate authentication
npm install feathers-horizon --save
```

Then import and configure the plugin after [Authentication](https://github.com/feathersjs/feathers-authentication) plugin
## Complete Example

Here's an example of a Feathers server that uses `feathers-horizon`. 

```js
const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const feathersHorizon = require('feathers-horizon');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const authentication = require('./authentication');
const rethinkdb = require('./rethinkdb');
const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rethinkdb);
app.configure(rest());
app.configure(socketio());
app.configure(services);
app.configure(authentication);
app.configure(feathersHorizon());

// Set up our services (see `services/index.js`) Configure middleware (see
// `middleware/index.js`) - always has to be last
app.configure(middleware);
app.hooks(appHooks);

//Create a default users for our tests. 
var User = {
		email: 'admin@feathersjs.com',
		password: 'admin',
		permissions: ['*']
};
app
		.service('users')
		.create(User)
		.then(user => {
				console.log('Created default user', user);
		})
		.catch(console.error);
module.exports = app;
```

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
