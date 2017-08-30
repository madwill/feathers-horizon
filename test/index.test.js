import {expect} from 'chai';
import feathersHorizon from '../src';
import feathers from 'feathers';
const configuration = require('feathers-configuration');

describe('feathersHorizon', () => {
  const app = feathers();

  beforeEach(() => {
    app.configure(configuration('./default.json'));
  });

  it('is CommonJS compatible', () => {
    expect(typeof require('../lib'))
      .to
      .equal('function');
  });

  it('basic functionality', () => {
    expect(typeof feathersHorizon)
      .to
      .equal('function', 'It worked');
    expect(typeof feathersHorizon())
      .to
      .equal('function', 'It worked');
  });
  it('Register plugin', () => {
    app.configure(feathersHorizon());
  });
  it('Test authenticationAfterCreate hook', () => {
    app.configure(feathersHorizon());
    // let something = plugin(); app.configure(feathersHorizon());
    let hook = {
      params: {
        user: {
          id: 'SOME-ID-ANYTHING-GOES'
        }
      },
      result: {}
    };
    app.authenticationAfterCreate(hook);
  });
});
