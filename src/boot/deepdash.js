import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  // eslint-disable-next-line no-undef
  app.config.globalProperties.deepdash = require('deepdash/standalone');
});
