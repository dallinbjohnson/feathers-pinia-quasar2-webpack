import feathersClient, { apiVuex } from '../../api/feathers-client';

const { makeServicePlugin, BaseModel } = apiVuex;

class PlacesAutoComplete extends BaseModel {
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'PlacesAutoComplete';

  // Define default properties here
  static instanceDefaults() {
    return {
      input: ''
    };
  }
}

const servicePath = 'places-auto-complete';
const servicePlugin = makeServicePlugin({
  Model: PlacesAutoComplete,
  service: feathersClient.service(servicePath),
  servicePath,
  idField: 'place_id',
});

// eslint-disable-next-line no-unused-vars
const requestHook = context => {
  // On success, context.params.googleMaps will include a `response`
  // eslint-disable-next-line no-console
  // console.log('requestHook: ', context);
};
// eslint-disable-next-line no-unused-vars
const successfullResponseHook = context => {
  // On success, context.params.googleMaps will include a `response`
  // eslint-disable-next-line no-console
  // console.log('successfullResponseHook: ', context);
};

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [requestHook],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [successfullResponseHook],
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
