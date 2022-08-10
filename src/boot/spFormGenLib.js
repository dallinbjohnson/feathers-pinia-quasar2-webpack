import { boot } from 'quasar/wrappers';
import spFormGenLib from '@sparkz-community/form-gen-client-lib';

export default boot(({ app }) => {
  app.use(spFormGenLib);
});


