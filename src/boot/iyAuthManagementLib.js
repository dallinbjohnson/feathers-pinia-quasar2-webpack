import { boot } from 'quasar/wrappers';
import iyAuthManagementLib from '@iy4u/auth-management-client-lib';

export default boot(({ app }) => {
  app.use(iyAuthManagementLib);
});


