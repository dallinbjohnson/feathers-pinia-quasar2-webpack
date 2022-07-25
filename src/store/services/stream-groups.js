import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

import {diff, /*lodash*/} from '@iy4u/common-client-lib';
// const {$lget, $lset} = lodash;

class StreamGroups extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'StreamGroups';

  static diffOnPatch(data) {
    // console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = StreamGroups.store.state['stream-groups'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }

  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      room: undefined,
      streams: [],
    };
  }

//   static setupInstance(data, { models }) {
//     let createdAt = $lget(data, 'createdAt');
//     if (typeof createdAt === 'string') {
//       $lset(data, 'createdAt', new Date(createdAt));
//     }
//     let updatedAt = $lget(data, 'updatedAt');
//     if (typeof updatedAt === 'string') {
//       $lset(data, 'updatedAt', new Date(updatedAt));
//     }
//
//     if ($lget(data, '_fastjoin.createdBy')) {
//       $lset(data, '_fastjoin.createdBy', new models.api.Users($lget(data, '_fastjoin.createdBy')));
//     }
//     if ($lget(data, '_fastjoin.updatedBy')) {
//       $lset(data, '_fastjoin.updatedBy', new models.api.Users($lget(data, '_fastjoin.updatedBy')));
//     }
//
//     let modelId = $lget(data, 'modelId');
//     if (modelId) {
//       let modelName = $lget(data, 'modelName');
//       if (modelName === 'ac-cards') {
//         $lset(data, '_fastjoin.modelId', new models.api.AcCards($lget(data, '_fastjoin.modelId')));
//       }
//     }
//     return data;
//   }

}

const servicePath = 'stream-groups';
const servicePlugin = makeServicePlugin({
  Model: StreamGroups,
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
