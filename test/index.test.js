import { expect } from 'chai';
import feathersHorizon from '../src';
import feathers from 'feathers';
const configuration = require('feathers-configuration');

describe('feathersHorizon', () => {
  const app = feathers();
  app.configure(configuration('./default.json'));

  beforeEach(() => {

  });

  it('is CommonJS compatible', () => {
    expect(typeof require('../lib')).to.equal('function');
  });

  it('basic functionality', () => {
    expect(typeof feathersHorizon).to.equal('function', 'It worked');
    expect(typeof feathersHorizon()).to.equal('function', 'It worked');
  });
  it('Register plugin', () => {
    app.configure(feathersHorizon());
  });
});
