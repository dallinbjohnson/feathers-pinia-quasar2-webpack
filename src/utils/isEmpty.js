module.exports = function isEmpty(val, options = {}) {
  let result = false;
  let returnDetails = false;
  if(options && options.details) returnDetails=true;

  if (!val && typeof val === 'undefined') {
    if(returnDetails) {
      result = {
        value: true,
        type: 'undefined'
      };
    } else {
      result = true;
    }
    // console.log('undefined');
  }
  if (!val && val === null) {
    if(returnDetails) {
      result = {
        value: true,
        type: 'null'
      };
    } else {
      result = true;
    }
    // console.log('null');
  }
  if (!val && val === '') {
    if(returnDetails) {
      result = {
        value: true,
        type: 'string'
      };
    } else {
      result = true;
    }
    // console.log('\'\'');
  }
  if (!val && val === 0) {
    if(returnDetails) {
      result = {
        value: false,
        type: 'number'
      };
    } else {
      result = false;
    }
    // console.log('0');
  }
  if (!!val && JSON.stringify(val) === '{}') {
    if(returnDetails) {
      result = {
        value: true,
        type: 'object'
      };
    } else {
      result = true;
    }
    // console.log('{}');
  }
  if (!!val && Array.isArray(val) && val.length === 0) {
    if(returnDetails) {
      result = {
        value: true,
        type: 'array'
      };
    } else {
      result = true;
    }
    // console.log('[]');
  }
  return result;
};
