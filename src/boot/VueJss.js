import { boot } from 'quasar/wrappers';

import JssPlugin from 'vue-jss-plugin';

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
// eslint-disable-next-line no-unused-vars
export default boot(({app}) => {
  app.use(JssPlugin);
});
