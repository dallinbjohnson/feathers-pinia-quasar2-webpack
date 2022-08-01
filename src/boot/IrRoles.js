import { boot } from 'quasar/wrappers';
import { abilitiesPlugin } from '@casl/vue';
import { Ability } from '@casl/ability';

export default boot(({ app }) => {
  const defaultAbility = new Ability();

  app.use(abilitiesPlugin, defaultAbility);
  app.config.globalProperties.$can = defaultAbility.can;
  app.config.globalProperties.$createEntity = function(path, item) {
    const classFn = new Function('item', `return new class ${path} {constructor(args) {Object.assign(this, item)}}`);
    return classFn(item);
  };
});

