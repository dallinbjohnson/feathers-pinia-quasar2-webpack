<template>
  <div class="group__avatar row">
    <div class="_avatar" v-for="(avatar, index) in avatars" :key="index">
     <vue-avatar
       :src="avatar"
       v-if="index < max"
       :last="index + 1 === max"
       :more_avatars="avatars.length === max ? 0 : max"
       :borderColor="borderColor"
       />
    </div>
  </div>
</template>

<script>
  import VueAvatar from 'pages/messages/components/VueGroupAvatar/VueAvatar';
  export default {
    name: 'vue-group-avatar',
    components: {VueAvatar},
    props: {
      max: {
        type: Number,
        default: 5,
      },
      avatars: {
        type: Array,
      },
      borderColor: {
        type: String,
        default: '#FFFFFF',
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
