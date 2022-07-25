<template>
  <search-input
    use-chips
    service="accounts"
    v-bind="$attrs"
    option-value="_id"
    option-label="name"
    multiple
    hide-dropdown-icon
    style="flex: 1;"
    dense
    @add="addAccount"
    @selected="selectedAccounts"
    :value="value"
  >
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps"
              v-on="scope.itemEvents">
        <q-item-section avatar>
          <q-avatar avatar text-color="white" color="accent">
            <q-img v-if="$lget(scope.opt, 'avatar.raw.file')"
                   :src="$lget(scope.opt, 'avatar.raw.file', '')"
            />
            <template v-else>{{ $lget(scope.opt, 'name', '').charAt(0) }}</template>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-bold">{{ $lget(scope.opt, 'name', '') }}</q-item-label>
          <q-item-label class="text-caption">{{ $lget(scope.opt, 'email', '') }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </search-input>
</template>

<script>
  import SearchInput from 'pages/messages/components/search-input';
  import {models} from '@feathersjs/vuex';

  export default {
    name: 'accounts-filter',
    components: {SearchInput},
    props: {
      value: {
        type: [Array, String],
        default() {
          return [];
        },
      },
    },
    methods: {
      addAccount(newVal) {
        console.log('will add: ', newVal);
        const ModelName = models.api.byServicePath['accounts'].modelName;

        const form = new models.api[ModelName]().clone();
        console.log(form);
        this.$emit('add', newVal);
      },
      selectedAccounts(newVal) {
        console.log('selected: ', newVal);
        this.$emit('input', newVal);
      },
    },
  };
</script>
