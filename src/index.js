// import errors from 'feathers-errors';
import makeDebug from 'debug';

const debug = makeDebug('feathers-horizon');

export default function init () {
  debug('Initializing feathers-horizon plugin');
  return 'feathers-horizon';
}
