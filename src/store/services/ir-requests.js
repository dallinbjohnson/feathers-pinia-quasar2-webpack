import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

// const common = require('../schemas/common');

class IrRequests extends BaseModel {
  // eslint-disable-next-line no-useless-constructor
  constructor (data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'IrRequests';
  // Define default properties here
  static instanceDefaults () {
    return {
      name: undefined,
      subject: undefined,
      body: undefined,
      contact: undefined,
      phone: undefined,
      affiliate: undefined,
      email: undefined,
      status: 'lead',
      assigned: undefined,
      appHost: undefined
    };
  }
}

const servicePath = 'ir-requests';
const servicePlugin = makeServicePlugin({
  Model: IrRequests,
  service: feathersClient.service(servicePath),
  servicePath
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
