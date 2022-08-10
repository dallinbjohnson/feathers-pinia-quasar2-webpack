import { boot } from 'quasar/wrappers';
import spCommonClientLib from '@sparkz-community/common-client-lib';

export default boot(({ app }) => {
  app.use(spCommonClientLib);
});


