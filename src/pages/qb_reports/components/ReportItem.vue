<template>
  <div style="max-width: 100%">
    <template  v-if="data.hasOwnProperty('Header')">
      <q-expansion-item
        :content-inset-level="($q.screen.sm || $q.screen.xs)?.1:.1"
        v-for="(item,index) in $lget(data, ['Rows','Row'])"
        switch-toggle-side
        expand-separator
        :key="index"
      >
        <template #header>

          <div  class="row items-center item-row justify-between q-px-sm">
            <template v-if="item.hasOwnProperty('Header')">
              <div class="row items-center item-row justify-between q-px-sm">
              <div>{{ $lget(item, ['Header','ColData','0','value']) }}</div>
              <div>{{ $lget(item, ['Header','ColData','1','value']) }}</div>
              </div>
            </template>
            <template v-else-if="item.hasOwnProperty('Summary')">
              <div class="row items-center item-row justify-between q-px-sm">
                <div>{{ $lget(item, ['Summary','ColData','0','value']) }}</div>
                <div>{{ $lget(item, ['Summary','ColData','1','value']) }}</div>
              </div>
            </template>
            <template v-else>
              <div class="row items-center item-row justify-between q-px-sm">
              <div>{{ $lget(item, ['ColData','0','value']) }}</div>
              <div>{{ $lget(item, ['ColData','1','value']) }}</div>
              </div>
            </template>
          </div>
        </template>
        <q-card flat square>

          <slot  name="child" v-bind="item">

          </slot>

        </q-card>
      </q-expansion-item>
    </template>
    <q-item
      :content-inset-level=".4"
      v-if="data.hasOwnProperty('Summary')"
      switch-toggle-side
      expand-separator
    >
      <div class="row items-center item-row justify-between q-px-sm">
        <div>{{ $lget(data, ['Summary','ColData','0','value']) }}</div>
        <div>{{ $lget(data, ['Summary','ColData','1','value']) }}</div>
      </div>

    </q-item>
  </div>
</template>

<script>
  export default {
    name: 'report-item',
    props:{
      data: {
        type: Object,
        required: true,
      }
    }
  };
</script>
<style lang="scss" scoped>

  .item-row{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 98%;
    @media (max-width: $breakpoint-sm-max) {
      width: 90%;
      font-size: 4vw;

    }
  }
</style>
