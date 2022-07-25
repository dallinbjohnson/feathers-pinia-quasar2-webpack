import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

import {diff, lodash} from '@iy4u/common-client-lib';
const {$lget, $lset} = lodash;

class Rooms extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Rooms';

  static diffOnPatch(data) {
    // console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = Rooms.store.state['rooms'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }

  // Define default properties here
  static instanceDefaults() {
    return {
      name: undefined,
      streamGroups: [],
      participantEvents: [],
      chats: [],
      participants: [],

      directMessage: undefined,
    };
  }

  static setupInstance(data, { models }) {
    if ($lget(data, '_fastjoin.participants', []).length) {
      $lset(data, '_fastjoin.participants', $lget(data, '_fastjoin.participants', []).map(participant => new models.api.Participants(participant)));
    }
    // if ($lget(data, '_fastjoin.createdBy')) {
    //   $lset(data, '_fastjoin.createdBy', new models.api.Users($lget(data, '_fastjoin.createdBy')));
    // }
    // if ($lget(data, '_fastjoin.updatedBy')) {
    //   $lset(data, '_fastjoin.updatedBy', new models.api.Users($lget(data, '_fastjoin.updatedBy')));
    // }
    //
    // let createdAt = $lget(data, 'createdAt');
    // if (typeof createdAt === 'string') {
    //   $lset(data, 'createdAt', new Date(createdAt));
    // }
    // let updatedAt = $lget(data, 'updatedAt');
    // if (typeof updatedAt === 'string') {
    //   $lset(data, 'updatedAt', new Date(updatedAt));
    // }

    return data;
  }
}

const servicePath = 'rooms';
const servicePlugin = makeServicePlugin({
  Model: Rooms,
  service: feathersClient.service(servicePath),
  servicePath,
  state: {},
  getters: {},
  mutations: {},
  actions: {}
});

/*
const beforeHook = context => {
  // eslint-disable-next-line no-console
  console.log('------------->>>> beforeHook - context.method:', context.method);
  console.log('------------->>>> beforeHook - context.params:', context.params);
  console.log('------------->>>> beforeHook - context.data:', context.data);
};
const afterHook = context => {
  // eslint-disable-next-line no-console
  console.log('------------->>>> afterHook - context.method:', context.method);
  console.log('------------->>>> afterHook - context.params:', context.params);
  console.log('------------->>>> afterHook - context.data:', context.data);
};
*/

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
    all: [
      /*afterHook*/
    ],
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
