import { boot } from 'quasar/wrappers';
import iyFormGenLib from '@iy4u/form-gen-client-lib';

export default boot(({ app }) => {
  app.use(iyFormGenLib);
});


