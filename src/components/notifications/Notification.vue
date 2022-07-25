<template>
  <q-item>
    <q-item-section avatar top>
      <q-icon v-if="notification.icon" :name="notification.icon || 'mdi-message-text-outline'" size="34px"/>
      <q-avatar v-else-if="notification.avatar" size="34px">
        <img :src="require(`../../assets/avatars/${notification.avatar}`)"/>
      </q-avatar>
      <q-icon v-else name="mdi-message-text-outline" size="34px"/>
    </q-item-section>

    <q-item-section top>
      <q-item-label lines="1">
        <div class="text-grey-7 cursor-pointer">{{ notification.from }}</div>
        <div class="cursor-pointer text-weight-medium">{{ notification.subject }}</div>
      </q-item-label>
      <q-item-label class="text-body2" lines="1">
        {{ notification.text }}
      </q-item-label>
    </q-item-section>

    <q-item-section top side>
      <div class="text-grey-7 q-gutter-xs">
        <q-btn size="sm" flat dense round icon="delete"/>
        <q-btn size="sm" flat dense round icon="done"/>
        <!--<q-btn size="12px" flat dense round icon="more_vert" />-->
      </div>
      <div class="text-grey-7 q-gutter-xs">
        {{ notification.date }}
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
  export default {
    name: 'Notification',
    components: {},
    props: {
      notification: {
        type: Object,
        default: null,
      },
    },
    data: function () {
      return {};
    },
    computed: {},
    watch: {},
    methods: {},
  };
</script>

<style scoped lang="scss">

</style>
