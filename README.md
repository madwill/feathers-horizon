# feathers-horizon

[![Build Status](https://travis-ci.org/madwill/feathers-horizon.svg?branch=master)](https://travis-ci.org/madwill/feathers-horizon)
<a href="https://codeclimate.com/github/madwill/feathers-horizon"><img src="https://codeclimate.com/github/madwill/feathers-horizon/badges/gpa.svg" /></a>
<a href="https://codeclimate.com/github/madwill/feathers-horizon/coverage"><img src="https://codeclimate.com/github/madwill/feathers-horizon/badges/coverage.svg" /></a>
[![GitHub issues](https://img.shields.io/github/issues/madwill/feathers-horizon.svg?style=flat-square)](https://github.com/madwill/feathers-horizon/issues)
[![Download Status](https://img.shields.io/npm/dm/feathers-horizon.svg?style=flat-square)](https://www.npmjs.com/package/feathers-horizon)

> Horizon.js feathers plugin

## Installation

```
npm install feathers-horizon --save
``` 

## Documentation

Please refer to the [feathers-horizon documentation](http://docs.feathersjs.com/) for more details.

## Complete Example

Here's an example of a Feathers server that uses `feathers-horizon`. 

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const plugin = require('feathers-horizon');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Initialize your feathers plugin
  .use('/plugin', plugin())
  .use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
```

## License

Copyright (c) 2017

Licensed under the [MIT license](LICENSE).
