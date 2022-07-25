import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

import {diff/*, lodash*/} from '@iy4u/common-client-lib';
// const {$lget, $lset} = lodash;

class WpbProjects extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'WpbProjects';

  static diffOnPatch(data) {
    console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = WpbProjects.store.state['wpb-projects'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }

  // Define default properties here
  static instanceDefaults () {
    return {
      name: undefined,
      pages: [],
      styleSheet: undefined,
      accessibleBy: 'owner',
      sharedAccessIds: [],
      visibility: 'private',
      ownerId: undefined,
      modelName: undefined
    };
  }
}

const servicePath = 'wpb-projects';
const servicePlugin = makeServicePlugin({
  Model: WpbProjects,
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
