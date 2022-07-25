<template>
  <q-card flat class="q-mt-xs">
    <div v-if="setDefault" class="row text-italic text-0-9 text-weight-light">Click {{title}} to make default</div>
    <q-list separator>
      <template v-for="(item, i) in items">
        <q-item clickable @click.stop="$emit('itemClick', item)" :key="`e-${i}`">
          <q-item-section>
            <q-item-label class="text-0-9" :style="{color: $q.dark.mode ? 'white' : 'black'}">{{$lget(item, itemLabel, item)}}</q-item-label>
            <q-item-label v-if="setDefault" caption class="text-0-7 text-italic text-weight-light text-primary"
                          v-show="defaultId === $lget(item, defaultPath, item)">default {{title}}
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn :color="$q.dark.mode ? 'red' : 'black'" icon="mdi-delete" round flat @click.stop="$emit('rmv', item)"/>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-card>
</template>

<script>
  export default {
    name: 'DefaultList',
    props: {
      setDefault: {
        type: Boolean,
        default: false
      },
      items: Array,
      removable: {
        type: Boolean,
        default: true
      },
      title: String,
      itemLabel: String,
      defaultPath: String,
      defaultId: String
    }
  };
</script>
