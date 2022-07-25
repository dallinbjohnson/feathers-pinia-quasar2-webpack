import {essentialFieldsConfig} from './essentialFieldsConfig';
import {lodash} from '@iy4u/common-client-lib';

const {$lget} = lodash;

export const commonFieldsConfig = [
  {
    name: 'applications',
    label: 'Applications',
    align: 'left',
    field: row => $lget(row, 'applications', []),
    format: val => val,
    sortable: true,
    isExpansion: true,
    hidden: true,
  },
  {
    name: 'environment',
    label: 'Environment',
    align: 'left',
    field: row => $lget(row, 'environment'),
    format: val => `${val}`,
    sortable: true,
    hidden: true,
  },
  ...essentialFieldsConfig,
];
