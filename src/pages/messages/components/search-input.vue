<template>
  <q-select v-bind="$attrs"
            :options="this['data']"
            :value="value"
            use-input
            @input="setModel"
            @filter="filterFn"
            new-value-mode="add-unique"
            @new-value="$emit('add', $event)">
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </q-select>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'search-input',
    inheritAttrs: false,
    props: {
      service: {
        type: String,
        required: true,
      },
      qid: String,
      path: {
        type: String,
        default: 'auto',
      },
      customQuery: {
        type: Object,
        default() {
          return {};
        },
      },
      useEmail: {
        type: Boolean,
        default: true,
      },
      searchField: {
        type: String,
        default: 'name',
      },
      value: {
        type: [Array, String],
        default() {
          return [];
        },
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 6,
        service() {
          return this.service;
        },
        name: 'data',
        infinite: true,
        query() {
          let query = this.$lmerge({
            $sort: {
              name: 1,
            },
          }, this.localQuery, this.customQuery);

          // if (!['', null, undefined].includes(this.search)) {
          //   this.$lset(query, '$or', [
          //     {
          //       name: {$regex: `${this.search}`, $options: 'igm'},
          //     },
          //     {
          //       email: {$regex: `${this.search}`, $options: 'igm'},
          //     },
          //   ]);
          // }
          return query;
        },
        params() {
          return {
            qid: this.qid,
            debounce: 500,
            [`${this.service}_fJoinHookResolversQuery`]: this.fastJoinResolverQuery,
          };
        },
      }),
    ],
    data() {
      return {
        sort: undefined,
        search: '',
        localQuery: {},
      };
    },
    mounted() {
      console.log(this.$attrs);
    },
    methods: {
      dataScroll() {
        this[`${this.service}CurrentPage`] += 1;
      },
      filterFn(val, update) {
        update(() => {
          const $search = val.toLocaleLowerCase();
          this.localQuery = this.useEmail ? {
            email: {$regex: `${$search}`, $options: 'igm'},
            name: {$regex: `${$search}`, $options: 'igm'},
          } : {
            [`${this.searchField}`]: {$regex: `${$search}`, $options: 'igm'},
          };
        });
      },
      setModel(val) {
        this.$emit('input', val);
      },
    },
  };
</script>
