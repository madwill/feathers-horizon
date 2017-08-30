const { authenticate } = require('feathers-authentication').hooks;

module.exports = {
  before: {
    all: [ perHooksForAll, authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function perHooksForAll(hook){
  console.log('hook', hook.data)

}
