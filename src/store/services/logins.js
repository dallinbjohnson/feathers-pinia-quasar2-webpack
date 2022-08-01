import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

import {diff, lodash} from '@iy4u/common-client-lib';
const {$lget, $lset} = lodash;

class Logins extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Logins';

  static diffOnPatch(data) {
    console.log('diffOnPatch data', data);
    if (data['_id']) {
      const originalObject = Logins.store.state['logins'].keyedById[data['_id']];
      return diff(originalObject, data);
    } else {
      return data;
    }
  }

  // Define default properties here
  static instanceDefaults() {
    return {
      email: undefined,
      name: undefined,
      phone: undefined,
      roles: [],
      phones: [],
      addresses: [],
      accounts: {
        owns: {
          ids: [],
          active: undefined
        },
        memberOf: []
      },
      settings: {
        theme: {
          darkMode: undefined,
          '--q-color-primary': undefined,
          '--q-color-secondary': undefined,
          '--q-color-accent': undefined,
          '--q-color-dark': undefined,

          '--q-color-positive': undefined,
          '--q-color-negative': undefined,
          '--q-color-info': undefined,
          '--q-color-warning': undefined,
        },
      },
      createdBy: undefined,
      updatedBy: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      avatar: undefined,
      banner: undefined,
      images: undefined,
    };
  }

  static setupInstance(data/*, { models }*/) {
    // if ($lget(data, '_fastjoin.accounts.owns.ids', []).length) {
    //   $lset(data, '_fastjoin.accounts.owns.ids', $lget(data, '_fastjoin.accounts.owns.ids', []).map(account => new models.api.Accounts(account)));
    // }
    // if ($lget(data, '_fastjoin.accounts.owns.active')) {
    //   $lset(data, '_fastjoin.accounts.owns.active', new models.api.Accounts($lget(data, '_fastjoin.accounts.owns.active')));
    // }

    let createdAt = $lget(data, 'createdAt');
    if (typeof createdAt === 'string') {
      $lset(data, 'createdAt', new Date(createdAt));
    }
    let updatedAt = $lget(data, 'updatedAt');
    if (typeof updatedAt === 'string') {
      $lset(data, 'updatedAt', new Date(updatedAt));
    }
    return data;
  }
}

const servicePath = 'logins';
const servicePlugin = makeServicePlugin({
  Model: Logins,
  service: feathersClient.service(servicePath),
  servicePath,
  state: {},
  getters: {},
  mutations: {},
  actions: {},
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [ctx => console.log(ctx)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

export default servicePlugin;
