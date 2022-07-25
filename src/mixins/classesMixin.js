// const $lget = require('lodash.get');
// const $set = require('lodash.set');
// const $lomitBy = require('lodash.omitby');
// const $lisNil = require('lodash.isnil');

export default function classesMixin(
  {
    nameSpace = '',
    path = 'classes',
    service,
  } = {}) {

  return {
    data() {
      return {
        nameSpace,
        path,
        service,
      };
    },
    computed: {
      classes() {
        return this.$lget(this, [nameSpace, path], []).map((rule) => rule.classValue);
      },
    },
    methods: {},
  };
}

