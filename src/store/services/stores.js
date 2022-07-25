import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;
import {diff} from '@iy4u/common-client-lib';

class Stores extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  static diffOnPatch(data) {
    console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = Stores.store.state['stores'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Stores';

  // Define default properties here
  static instanceDefaults() {
    return {
      product: undefined,
      saleReps: [],
      ownership: {
        owners: [],
      },
      membership:[],
      quickbooksConnection: undefined,
      glClass: undefined,
      glDepartment: undefined,
    };
  }
}

const servicePath = 'stores';
const servicePlugin = makeServicePlugin({
  Model: Stores,
  service: feathersClient.service(servicePath),
  servicePath,
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
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
});

export default servicePlugin;
