import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;
import {diff} from '@iy4u/common-client-lib';

class GlDepartments extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  static diffOnPatch(data) {
    console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = GlDepartments.store.state['gl-departments'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'GlDepartments';



  // Define default properties here
  static instanceDefaults() {
    return {
      name: undefined,
    };
  }
}

const servicePath = 'gl-departments';
const servicePlugin = makeServicePlugin({
  Model:GlDepartments,
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
