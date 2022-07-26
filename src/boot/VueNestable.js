import { boot } from 'quasar/wrappers';

import VueNestable from 'vue-nestable';

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
// eslint-disable-next-line no-unused-vars
export default boot(({app}) => {
  app.use(VueNestable);
});
