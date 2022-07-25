import {lodash} from '@iy4u/common-client-lib';
const {$lget} = lodash;

export const colorHelpers = {
  methods: {
    getCardColor(task) {
      let p = $lget(task, 'priority');
      if(p === 'low') return '#ffe043';
      else if(p === 'medium')  return '#f1a329';
      else if(p === 'high')  return '#fc733c';
      else if(p === 'critical')  return '#b70000';
      else return '#a7c1d7';
    }
  }
};
