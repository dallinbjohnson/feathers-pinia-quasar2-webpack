<template>
  <div class="__avatar" :style="[{ border: `2px solid ${borderColor}` }]">
    <q-img :src="src" v-bind="imgAttrs" class="img" alt=""/>
    <div v-if="last" class="__panel_show_more">
      <div>+{{ more_avatars }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'vue-avatar',
    props: {
      src: {
        type: String,
        default: '',
      },
      last: {
        type: Boolean,
        default: false,
      },
      more_avatars: {
        type: Number,
        default: 0,
      },
      borderColor: {
        type: String,
      },
      imgAttrs: {
        type: Object
      }
    },
  };
</script>

<style scoped lang="scss">
  .__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50px;
    overflow: hidden;
    border: 2px solid white;
    transition: all 0.25s ease;
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: -1rem;
    margin-right: -1rem;
    .__panel_show_more {
      position: absolute;
      background-color: rgba(10, 12, 18, 0.5);
      width: 100%;
      height: 100%;
      z-index: 3;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }

    &:hover {
      -webkit-transform: translate(-3px);
      transform: translate(-3px);

    }

    .img {
      height: 100%;
      width: 100%;
      object-fit: cover;

    }
  }
</style>
