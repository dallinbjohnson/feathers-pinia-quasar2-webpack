<template>
  <select-input @input-value="search = $event"
                @input="$emit('input', $event)"
                @keydown="preventSpecialCharacter($event)"
                v-model="selection"
                path="auto"
                :slots="['append','after-options', 'option']"
                :div-attrs="{class: ''}"
                :attrs="selectAttrs"
                style="flex: 1;">
    <template v-slot:append>
      <q-icon name="search"/>
    </template>

    <template v-slot:after-options v-if="accounts.length < accountsTotal">
      <q-item>
        <q-item-section @click="accountScroll">
          <div>
            <div>Load More
              <q-icon name="add" size="sm"/>
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps"
              v-on="scope.itemEvents">
        <q-item-section avatar>
          <q-avatar text-color="white" color="accent">
            <img v-if="$lget(scope.opt, 'avatar.raw.file')"
                 :src="$lget(scope.opt, 'avatar.raw.file', '')">
            <template v-else>{{ $lget(scope.opt, 'name', '').charAt(0) }}</template>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $lget(scope.opt, 'name', '') }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </select-input>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import SelectInput
    from '@iy4u/form-gen-client-lib/src/components/common/atoms/SelectInput/SelectInput';

  export default {
    name: 'AccountSearchOld',
    components: {
      SelectInput,
    },
    props: {
      filterOut: {
        type: Array,
      },
      multiple: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 6,
        service: 'accounts',
        name: 'accounts',
        qid: 'searchAccounts',
        infinite: true,
        query() {
          let query = {
            $sort: {
              name: 1,
            },
            _id: {
              $nin: this.filterOut ? this.filterOut : [],
            },
          };

          if (!['', null, undefined].includes(this.search)) {
            this.$lset(query, '$or', [
              {
                name: {$regex: `${this.search}`, $options: 'igm'},
              },
              {
                email: {$regex: `${this.search}`, $options: 'igm'},
              },
            ]);
          }
          return query;
        },
        params() {
          return {
            qid: this.qid,
            debounce: 500,
          };
        },
      }),
    ],
    data() {
      return {
        sort: undefined,
        search: '',
        selection: null,
      };
    },
    computed: {
      selectAttrs() {
        return {
          label: this.multiple ? 'Search For Accounts Here...' : 'Search For an Account Here...',
          // eslint-disable-next-line no-unused-vars
          filterFn(val, update, abort) {
            update(() => {
            });
          },
          'fill-input': !this.multiple,
          hint: 'Search Account Name or Email Address',
          'map-options': true,
          'option-value': '_id',
          'option-label': 'name',
          multiple: this.multiple,
          'hide-selected': !this.multiple,
          filled: true,
          behavior: 'menu',
          style: 'border-radius: 0.6em; overflow: hidden;',
          options: Object.freeze(this.accounts.slice(0)),
        };
      },
    },
    methods: {
      preventSpecialCharacter(e) {
        if (/[^\w ]/.test(e.key)) {
          e.preventDefault();
        }
      },
      accountScroll() {
        this.accountsCurrentPage += 1;
      },
    },
  };
</script>

<style scoped>

</style>
