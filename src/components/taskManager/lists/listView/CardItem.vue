<template>
  <div>
    <q-item v-bind="{...{clickable: true}, ...itemProps}" :style="{...{width: '100%'}, ...$lget(itemProps,'style', {})}" @click="$emit('input', value)">
      <q-item-section avatar>
        <q-avatar :style="{background: getCardColor(value)}"></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-xs text-mb-xs text-weight-medium">{{$lget(value, 'name')}}</q-item-label>
        <q-item-label style="width: 90%" class="__one-liner text-xxs text-mb-xxs text-grey-8">{{$lget(value, 'description')}}</q-item-label>
        <div class="row items-center">
          <div v-for="(owner, i) in $lget(value, '_fastjoin.owners', [])" :key="`owner-${i}`">
            <q-chip dark size="sm">
              <default-avatar :value="owner"></default-avatar>
              {{owner.name}}
            </q-chip>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {colorHelpers} from 'components/taskManager/mixins/colorHelper';

  export default {
    name: 'CardItem',
    components: { DefaultAvatar },
    mixins: [colorHelpers],
    props: {
      value: Object,
      itemProps: {
        type: Object,
        default: () => {
          return {};
        }
      }
    }
  };
</script>

<style scoped>

</style>
