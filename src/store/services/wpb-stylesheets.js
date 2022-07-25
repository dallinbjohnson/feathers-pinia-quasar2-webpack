import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

import {diff/*, lodash*/} from '@iy4u/common-client-lib';
// const {$lget, $lset} = lodash;

class WpbStylesheets extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'WpbStylesheets';

  static diffOnPatch(data) {
    console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = WpbStylesheets.store.state['wpb-stylesheets'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }

  // Define default properties here
  static instanceDefaults() {
    return {

    };
  }
}

const servicePath = 'wpb-stylesheets';
const servicePlugin = makeServicePlugin({
  Model: WpbStylesheets,
  service: feathersClient.service(servicePath),
  servicePath,
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});

// const beforeHook = context => {
//   // eslint-disable-next-line no-console
//   console.log('------------->>>> beforeHook - context.method:', context.method);
//   console.log('------------->>>> beforeHook - context.params:', context.params);
//   console.log('------------->>>> beforeHook - context.data:', context.data);
// };
// const afterHook = context => {
//   // eslint-disable-next-line no-console
//   console.log('------------->>>> afterHook - context.method:', context.method);
//   console.log('------------->>>> afterHook - context.params:', context.params);
//   console.log('------------->>>> afterHook - context.data:', context.data);
// };

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [/*beforeHook*/],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [/*afterHook*/],
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
});

export default servicePlugin;
