import { boot } from 'quasar/wrappers';
// import createStore from '../stores';

// eslint-disable-next-line no-undef
const requireModule = require.context(
  // The path where the service modules live
  '../stores/services',
  // Whether to look in subfolders
  false,
  // Only include .js files (prevents duplicate imports`)
  /.js$/,
);
const servicePlugins = requireModule
  .keys()
  .map(modulePath => requireModule(modulePath).default);
import auth from '../stores/store.auth';

export default boot((/*{ app }*/) => {
  // app.use(createStore({}));
  servicePlugins.forEach(fn => fn());
  auth();
});


