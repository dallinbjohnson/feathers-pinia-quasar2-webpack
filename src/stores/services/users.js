import feathersClient from '../../api/feathers-client';
import { defineStore, BaseModel } from 'feathers-pinia';

// eslint-disable-next-line no-undef
const {get, set} = require('lodash');

export class Users extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Define default properties here
  static instanceDefaults(/*data, {models, store}*/) {
    return {
      email: undefined,
      name: undefined,
      phone: undefined,
      roles: [],
      phones: [],
      addresses: [],
      logins: {
        ids: [],
        active: undefined,
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

  static setupInstance(data, { models }) {
    if (get(data, '_fastjoin.logins.ids', []).length) {
      set(data, '_fastjoin.logins.ids', get(data, '_fastjoin.logins.ids', []).map(login => {
        let newLogin = new models.api.Logins(login);
        newLogin.addToStore();
        return newLogin;
      }));
    }
    if (get(data, '_fastjoin.logins.active')) {
      let newLogin = new models.api.Logins(new models.api.Logins(get(data, '_fastjoin.logins.active')));
      newLogin.addToStore();
      set(data, '_fastjoin.logins.active', newLogin);
    }

    let createdAt = get(data, 'createdAt');
    if (typeof createdAt === 'string') {
      set(data, 'createdAt', new Date(createdAt));
    }
    let updatedAt = get(data, 'updatedAt');
    if (typeof updatedAt === 'string') {
      set(data, 'updatedAt', new Date(updatedAt));
    }
    return data;
  }
}

const servicePath = 'users';
const useStore = defineStore({
  Model: Users,
  servicePath,
  clients: { api: feathersClient },
  idField: '_id',
  state() {
    return {};
  },
  getters: {},
  actions: {},
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

export default useStore;
