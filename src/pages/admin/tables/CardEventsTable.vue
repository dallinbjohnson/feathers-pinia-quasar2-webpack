<template>
  <f-data-table title="Card Events"
                service="card-events"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    cardEventResolversQuery: {
                      card: [
                        ['_id', 'name']
                      ]
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Card Event"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';

  export default {
    name: 'CardEventsTable',
    props: {
      removeColumns: {
        type: Array,
        default() {
          return [];
        },
      },
      query: {
        type: Object,
        default() {
          return {};
        }
      },
      qid: {
        type: String,
        default: 'cardEventsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'cards',
        name: 'cards',
        qid: 'cardsCardEventsAdmin',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
    ],
    data() {
      return {
        formData: {},
      };
    },
    computed: {
      columns() {
        return [
          {
            name: '_id',
            label: '_id',
            align: 'left',
            field: row => this.$lget(row, '_id'),
            format: val => `${val}`,
            sortable: true,
            hidden: true,
          },
          {
            name: 'title',
            label: 'Title',
            align: 'left',
            field: row => this.$lget(row, 'title'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'subtitle',
            label: 'Subtitle',
            align: 'left',
            field: row => this.$lget(row, 'subtitle'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'body',
            label: 'Body',
            align: 'left',
            field: row => this.$lget(row, 'body'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'card',
            label: 'Card',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.card.name', this.$lget(row, 'card')),
            format: val => `${val}`,
            sortable: true,
          },

          ...commonFieldsConfig,

          {
            name: 'actions',
            label: 'Actions',
            align: 'center',
            required: true,
          },
        ];
      },

      formFields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'title',
            attrs: {
              label: 'title',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'subtitle',
            attrs: {
              label: 'subtitle',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'body',
            attrs: {
              label: 'body',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              type: 'textarea'
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'card',
            attrs: {
              label: 'Card',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.cards,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
  };
</script>

<style scoped>

</style>
