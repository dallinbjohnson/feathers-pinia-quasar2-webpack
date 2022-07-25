import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

class Accounts extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Accounts';

  // Define default properties here
  static instanceDefaults() {
    return {
      name: undefined,
      email: undefined,
      description: undefined,
      avatar: {},
      banner: {},
      profileImg: '',
      addresses: [],
      phones: [],
      socialLinks: [],
      logins: {
        ownedBy: [],
        members: [],
      },
      images: [],
      ownership: {
        owners: undefined,
        owns: undefined,
      },
      membership: {
        members: undefined,
        membersOf: undefined,
      },
      authOwnerId: undefined,
      authModelName: undefined,
      responsibleForEnvironments: [],
      settings: {
        theme: undefined,
        hosts: undefined,
        instances: undefined,
        applications: undefined,
        domains: undefined,
        environments: undefined,
        accounts: undefined,
      },
      participant: undefined,
      deleted: undefined,
      deletedAt: undefined,
      applications: [],
      environment: undefined,
      createdBy: {
        account: undefined,
        user: undefined,
        login: undefined,
        integration: undefined,
        fingerprint: undefined,
      },
      updatedBy: {
        account: undefined,
        user: undefined,
        login: undefined,
        integration: undefined,
        fingerprint: undefined,
      },
      updatedByHistory: {
        account: undefined,
        user: undefined,
        login: undefined,
        integration: undefined,
        fingerprint: undefined,
        updatedAt: undefined,
      },
      external: {
        createdBySource: {
          id: undefined,
          Model: undefined,
        },
        updatedBySource: {
          id: undefined,
          Model: undefined,
        },
        updatedBySourceHistory: {
          updatedBy: undefined,
          updatedByHistoryModel: undefined,
          updatedAt: undefined,
        },
        meta: undefined,
      },
    };
  }
}

const servicePath = 'accounts';
const servicePlugin = makeServicePlugin({
  Model: Accounts,
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
