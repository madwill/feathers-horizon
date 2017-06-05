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
