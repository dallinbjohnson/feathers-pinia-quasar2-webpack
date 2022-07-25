import {lodash} from '@iy4u/common-client-lib';
const {$lget, $lset, $lisEqual, $lisEmpty, $lflattenDeep} = lodash;

const isEmailRule = (val) => {
  let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
  return !reg.test(val);
};

const validators = {
  notEmpty: {
    label: 'Not Empty',
    description: 'Make sure field is not empty',
    args: false,
    method: (field, type, format) => {
      let fieldCheck = field && (field.value || field.value === 0) && typeof field.value !== 'undefined';
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? format(field) : true;
      return fieldCheck && typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return error ? error : `${field.name} cannot be empty.`;
    }
  },
  eq: {
    label: 'Equals',
    description: 'Field must equal',
    args: true,
    method: (field, val, format) => {
      let fieldCheck = field && field.value === val;
      let formatCheck = format ? format(field) : true;
      return fieldCheck && formatCheck;
    },
    err: (field, val, error) => {
      return error ? error : `${field.name} must equal ${val}`;
    }
  },
  ne: {
    label: 'Does not equal',
    description: 'Field must not equal',
    args: true,
    method: (field, val, format) => {
      let fieldCheck = field && JSON.stringify(field.value) !== JSON.stringify(val);
      let formatCheck = format ? format(field) : true;
      return fieldCheck && formatCheck;
    },
    err: (field, val, error) => {
      return error ? error : `${field.name} cannot equal ${val}.`;
    }
  },
  length: {
    label: 'Length',
    description: 'Length exactly',
    args: true,
    method: (field, val, format) => {
      let fieldCheck = field && field.value && String(String(field.value).length) === val;
      let formatCheck = format ? format(field) : true;
      return fieldCheck && formatCheck;
    },
    err: (field, val, error) => {
      return error ? error : `${field.name} must have a length of ${val}.`;
    }
  },
  type: {
    label: 'Type',
    description: 'Validate field type (String, Number, List)',
    args: true,
    method: (field, type, format) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? format(field) : true;
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return error ? error : `${field.name} must be type ${type}.`;
    }
  },
  format: {
    method: (field, type, format) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? format(field) : true;
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return error ? error : `${field.name} - error`;
    }
  },
  sameAs: {
    method: (field, type, format) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? field.value === format : true;
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return error ? error : `${field.name} - error`;
    }
  },
  arrayLength: {
    label: 'List Length',
    description: 'Check that list is at least some length',
    args: true,
    method: (field, number) => {
      return Array.isArray(field.value) && field.value.length >= parseFloat(number);
    },
    err: (field, number, error) => {
      return `${field.name} requires at least ${number} selection${number === '1' ? '' : 's'}. ${error ? error : ''}`;
    }
  },
  gt: {
    label: 'Greater than',
    description: 'Check that number is greater than or string has more characters than',
    args: true,
    method: (field, number) => {
      if (typeof field.value === 'number') return field.value > parseFloat(number);
      else if (['array', 'string'].includes(typeof field.value)) {
        let length = $lget(field, 'value', []).length;
        return length > parseFloat(number);
      }
    },
    err: (field, number, error) => {
      return `${field.name} ${typeof field.value === 'number' ? '' : 'length'} must be greater than ${number}. ${error ? error : ''}`;
    }
  },
  lt: {
    label: 'Less than',
    description: 'Check that number is less than or string has less characters than',
    args: true,
    method: (field, number) => {
      if (typeof field.value === 'number') return field.value < parseFloat(number);
      else if (['array', 'string'].includes(typeof field.value)) {
        let length = $lget(field, 'value', []).length;
        return length < parseFloat(number);
      }
    },
    err: (field, number, error) => {
      return `${field.name} ${typeof field.value === 'number' ? '' : 'length'} cannot exceed ${number}. ${error ? error : ''}`;
    }
  },
  password: {
    label: 'Password',
    description: 'Check for password strength',
    args: true,
    // TODO: functions dont actually check for count of special, uppercase lowercase - just qthat there is one
    method: (field, type = { length: 8, uppercase: 1, lowercase: 1, special: 1 }) => {
      let v = $lget(field, 'value', 'a');
      let len = $lget(type, 'length') ? v.length >= length : true;
      let upper = $lget(type, 'uppercase') ? v.toLowerCase() !== v : true;
      let lower = $lget(type, 'lowercase') ? v.toUpperCase() !== v : true;
      // eslint-disable-next-line no-useless-escape
      let spec = $lget(type, 'special') ? /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(v) : true;
      // console.log('password check', field, type, v, len, upper, lower, spec);
      return !!(len && upper && lower && spec);
    },
    err: (field, type = { length: 8, uppercase: 1, lowercase: 1, special: 1 }, error) => {
      // console.log('run err', field, type, error);
      if (error) return error;
      else {
        let v = $lget(field, 'value', 'a');
        let len = $lget(type, 'length') ? v.length >= length : true;
        let upper = $lget(type, 'uppercase') ? v.toLowerCase() !== v : true;
        let lower = $lget(type, 'lowercase') ? v.toUpperCase() !== v : true;
        // eslint-disable-next-line no-useless-escape
        let spec = $lget(type, 'special') ? /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(v) : true;
        let str = 'Password Requirements:';
        if (!len) str += ` At least ${length} characters -`;
        if (!upper) str += ` At lease ${$lget(type, 'uppercase')} upper case letter${$lget(type, 'uppercase') === 1 ? '' : 's'}`;
        if (!lower) str += ` At lease ${$lget(type, 'lowercase')} lower case letter${$lget(type, 'lowercase') === 1 ? '' : 's'}`;
        if (!spec) str += ` At lease ${$lget(type, 'special')} special character${$lget(type, 'special') === 1 ? '' : 's'} (!@#$%^&*()_+)`;
        return str;
      }
    }
  },
  email: {
    label: 'Email',
    description: 'Check for a valid email',
    args: false,
    method: (field, type) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = !isEmailRule(field.value);
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return error ? error : `${field.name} - Enter a valid email`;
    }
  },
  phone: {
    label: 'Phone',
    description: 'Check for a valid phone',
    args: false,
    method: (field) => {
      if(['number', 'string'].includes(typeof field.value)){
        //eslint-disable-next-line
        let numTest = new RegExp('^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$');
        return numTest.test(field.value);
      }
      else return field.value.isValid;
    },
    err: (field, type, error) => {
      return error ? error : `${field.name} - Enter a valid phone number`;
    }
  }
};

// const formatRules = {
//   email: {
//     format: (val) => {
//       return !isEmailRule(val.value);
//     }
//   }
// };

export const vCheck = {
  // eslint-disable-next-line no-unused-vars
  data() {
    return {
      //must set these properties in local component - issues exporting them here
      vErrors: {},
      vDirty: {},
      isVDirty: false,
      valid: {},
    };
  },
  watch: {
    validForm: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        // console.log('see changes', newVal, oldVal);
        if (this.updateValidOnInput) {
          this.$vRefreshErrors(newVal, oldVal);
        }
      }
    },
  },
  computed: {
    functionList() {
      return Object.keys(validators);
    },
    validatorsList() {
      let list = [];
      this.functionList.forEach(key => {
        if (validators[key].label) {
          let obj = Object.assign({}, validators[key]);
          obj.key = key;
          list.push(obj);
        }
      });
      return list;
    },
    validForm() {
      return this.vCheckForm ? Object.assign({}, this.vCheckForm) : {};
    },
    $vErrorList() {
      let errorList = [];
      let list = this.vErrors ? Object.keys(this.vErrors) : [];
      let errors = this.vErrors;

      const pushErr = key => {
        if ($lget(errors, key)) {
          if ($lget(errors, key) && typeof $lget(errors, key) === 'object') {
            Object.keys($lget(errors, key)).forEach(k => {
              pushErr(`${key}.${k}`);
            });
          } else errorList.push($lget(errors, key));
        }
      };

      list.forEach(key => {
        if (errors[key]) {
          pushErr(key);
        }
      });
      return errorList;
    }
  },
  methods: {
    passwordStrength(val) {

      const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
      const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z,A-Z])(?=.*[0-9]))|((?=.*[a-z,A-Z])(?=.*[!@#$%^&*]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
      if (typeof val !== 'string') {
        throw new TypeError(`path: plugins/validators.js  --  password strength validation error: expected type 'string' - got ${typeof val}`);
      } else if (!val.length) {
        return 'empty';
      } else if (strongRegex.test(val)) {
        return 'Strong';
      } else if (mediumRegex.test(val)) {
        return 'Medium';
      } else {
        return 'Weak';
      }
    },
    isEmailRule(val) {
      let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
      return !reg.test(val);
    },
    $flatObjKeyList(obj, path) {
      let list = [];
      if (!$lisEmpty(obj)) {
        Object.keys(obj).forEach(key => {
          let newPath = path ? `${path}.${key}` : key;
          let getVal = $lget(obj, key, '');
          // console.log('see change');
          let pathToAdd = typeof getVal === 'object' && !Array.isArray(getVal) ? this.$flatObjKeyList(getVal, newPath) : newPath;
          list.push(pathToAdd);
        });
      }
      return $lflattenDeep(list);
    },
    $getSaveObj(vCheck) {
      let obj = {};
      let form = vCheck ? vCheck : this.vCheckForm;
      if (form) {
        let list = this.$flatObjKeyList(form);
        // console.log('got list', list);
        list.forEach(key => {
          if ($lget(this.vDirty, key)) {
            $lset(obj, key, $lget(form, key));
          }
        });
      }
      return obj;
    },
    $vRefreshErrors(newVal, oldVal) {
      if (oldVal && typeof oldVal === 'object' && Object.keys(oldVal).length) {
        let equal = $lisEqual(newVal, oldVal);
        if (oldVal && !equal && newVal) {
          this.isVDirty = true;
          const layerDeep = (val, oVal, path) => {
            Object.keys(val).forEach(key => {
              let newPath = path ? `${path}.${key}` : key;
              let getVal = $lget(val, key, '');
              let getOVal = $lget(oVal, key, '');
              // console.log('check equal', getVal, oVal, key);
              if (!!(getVal || getOVal) && !$lisEqual(getVal, getOVal)) {
                // console.log('see change', key, getVal, oVal);
                if (getVal && typeof getVal === 'object' && !Array.isArray(getVal)) {
                  layerDeep(getVal, $lget(oVal, key), newPath);
                } else {
                  // console.log('is dirty', newPath, getVal, oVal, key);
                  $lset(this.vDirty, newPath, true);
                  // console.log('set dirty', this.vDirty);
                }
              }
            });
          };
          layerDeep(newVal, oldVal);
          // let errs = this.$vCheck(newVal);
          // console.log('errs', errs);
          this.$vCheck(newVal);
        }
      }
    },
    $vErrorCheck(prop) {
      let dirty = this.vDirty ? Object.assign({}, this.vDirty) : {};
      if ($lget(dirty, prop)) {
        return $lget(this.vErrors, prop, false) ? true : false;
      } else return false;
    },
    $vErrorMessage(prop) {
      let dirty = this.vDirty ? Object.assign({}, this.vDirty) : {};
      if ($lget(dirty, prop)) {
        return $lget(this.vErrors, prop, '');
      } else return '';
    },
    $vRuleCheck(prop) {
      let dirty = this.vDirty ? Object.assign({}, this.vDirty) : {};
      if ($lget(dirty, prop)) {
        let err = $lget(this.vErrors, prop, false);
        return err ? [err] : true;
      } else return true;
    },
    $vGetErrorList(errors) {
      let errorList = [];
      let list = errors ? Object.keys(errors) : [];

      const pushErr = key => {
        if ($lget(errors, key)) {
          if ($lget(errors, key) && typeof $lget(errors, key) === 'object') {
            Object.keys($lget(errors, key)).forEach(k => {
              pushErr(`${key}.${k}`);
            });
          } else errorList.push($lget(errors, key));
        }
      };

      list.forEach(key => {
        if (errors[key]) {
          pushErr(key);
        }
      });
      return errorList;
    },
    $vErrNotify(err) {
      this.$q.notify({
        message: err,
        position: 'bottom',
        color: 'negative',
        timeout: 10000,
        actions: [{ icon: 'mdi-close', color: 'white' }],
        icon: 'mdi-information'
      });
    },

    //validCheck is an object and v can either ben an array like v: ['notEmpty', 'type:string'] or an object like
    // v: {
    // check: 'notEmpty',
    // arg: 'string',
    // format: <some regex or other check function>
    // error: 'Error message'
    // }
    $vCheck(form, validCheck) {
      //You can pass in a custom validCheck such as in needing to use this for two objects in one component
      let valid = validCheck ? validCheck : this.validCheck;
      // console.log('vCheck', form, valid);

      let errors = {};
      let key_list = valid ? Object.keys(valid) : [];

      key_list.forEach(key => {
        let keyProp = valid[key];
        let methods = $lget(keyProp, 'v');
        if (Array.isArray(methods)) {
          methods.forEach(method => {
            // console.log('checking method', key, form, keyProp);
            let fieldObj = { value: $lget(form, key), name: $lget(keyProp, 'name', key) };
            let v = method.split(':');
            // console.log('v', v, methods, method);
            let prop = v[0];
            let arg = v[1];
            // console.log('prop', prop, validators[prop]);
            let validator = $lget(validators, prop);
            let check = validator ? validator['method'](fieldObj, arg) : null;
            // console.log('check', check, fieldObj, arg);
            if (!check) $lset(errors, key, validator['err'](fieldObj, arg));
            else {
              // console.log('check success - removing error for ', key);
              $lset(errors, key, null);
            }
          });
        } else {

          let fieldObj = { value: $lget(form, key), name: $lget(keyProp, 'name', key) };
          // console.log('got field obj', fieldObj, key, form);

          let prop = $lget(methods, 'check');
          let arg = $lget(methods, 'arg');

          //For format functions remember that the field value is at .value
          let validator = $lget(validators, prop);

          let format = $lget(methods, 'format');
          let error = validator ? validator['err'](fieldObj, arg, $lget(methods, 'err')) : $lget(methods, 'err');
          // console.log('prop', methods, key, prop, validators[prop]);

          let check = validator ? validator['method'](fieldObj, arg, format) : true;
          // console.log('not array', 'key', key, 'prop', prop, 'arg', arg, 'format', format, 'error', error, 'check', check);
          if (!check) {
            // console.log('ggot err', validators[prop].err(fieldObj, arg, error), fieldObj, arg);
            $lset(errors, key, validator['err'](fieldObj, arg, error));
          } else {
            // console.log('check success - removing error for ', key);
            $lset(errors, key, null);
          }
        }
      });
      // console.log('set errors', errors);
      this.vErrors = this.vErrors ? { ...this.vErrors, ...errors } : Object.assign({}, errors);
      return this.$vGetErrorList(errors);
    }
  }
};
