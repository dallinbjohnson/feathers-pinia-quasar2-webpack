import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;


class Messages extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Messages';

  // Define default properties here
  static instanceDefaults() {
    return {
      from: undefined,
      to: [],
      subject: undefined,
      body: '',
      isExternal: true,
      status: 'new',
      attachments: [],
      replies: []
    };
  }
}

const servicePath = 'in-app-messages';
const servicePlugin = makeServicePlugin({
  Model: Messages,
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

export default servicePlugin;
