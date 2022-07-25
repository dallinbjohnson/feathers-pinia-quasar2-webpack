import {essentialFieldsConfig} from './essentialFieldsConfig';
import {lodash} from '@iy4u/common-client-lib';

const {$lget} = lodash;

export const coreFieldsConfig = [
  {
    name: 'settings',
    label: 'Settings',
    align: 'left',
    field: row => $lget(row, 'settings', []),
    format: val => val,
    sortable: true,
    // hidden: true,
    isExpansion: true,
  },
  ...essentialFieldsConfig,
];
