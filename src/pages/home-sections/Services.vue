<template>
  <div v-bind="{class: '__services', ...$attrs.divAttrs}">
    <div class="row justify-center"
         v-bind="{class: 'text-xl text-mb-xl text-weight-bold q-mb-lg', ...$attrs.titleAttrs}" v-if="$attrs.title">
      <div>
        <div>{{ $attrs.title }}</div>
        <q-separator class="q-my-md"></q-separator>
      </div>
    </div>
    <div class="row justify-center">
      <div class="__mid">
        <div
            v-for="(service, i) in services" :key="`service-${i}`"
            class="row justify-center q-py-lg"
            :style="{
              transition: 'all .4s ease-out',
              transform: hover === i ? 'translate(20px, -10px) scale(1.1)' : hover > -1 ? 'translate(-10px, 0)' : ''
            }"
            @pointerenter="hover = i"
            @pointerleave="hover = -1"
        >
          <div class="col-12 col-md-3 q-pa-md"
               :style="$q.screen.lt.md ? '' : 'border-right: solid .2px rgba(0,0,0,.4)'">
            <div class="flex flex-center">
              <div>

                <div>
                  <q-icon v-if="service.icon" v-bind="service.icon"></q-icon>
                  <q-img v-if="service.img" v-bind="service.img"></q-img>
                </div>
                <div
                    v-bind="{
              class: 'text-lg text-mb-lg text-weight-medium', style: 'line-height: 1',
              ...service.titleAttrs
            }"
                >
                  {{ service.title }}
                </div>
                <div v-bind="{class: 'text-sm text-mb-sm text-weight-light text-right', ...service.subtitleAttrs}">
                  {{ service.subtitle }}
                </div>
                <div v-if="$q.screen.lt.md">
                  <q-separator class="q-my-sm"></q-separator>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 q-pa-md">
            <div :class="`flex flex-center full-height text-${$q.screen.lt.md ? 'center' : 'left'}`">
              <div v-bind="{class: 'text-sm text-mb-sm', style: 'width: 600px; max-width: 100%;', ...$attrs.captionAttrs}"> {{ service.caption }}</div>
            </div>
            <div class="row">
              <fade-transition>
                <q-btn @click="$emit('start')" v-if="hover === i" flat color="accent" icon-right="mdi-chevron-right" label="Try it"></q-btn>
              </fade-transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FadeTransition from 'components/common/transitions/FadeTransition';
  export default {
    name: 'Services',
    components: { FadeTransition },
    props: {
      services: Array
    },
    data(){
      return {
        hover: -1
      };
    }
  };
</script>

<style scoped lang="scss">
  .__services {
    padding: 5vh 5% 10vh 5%;
  }

  .__mid {
    width: 1300px;
    max-width: 100%;
  }

  .vert {
    height: 100%;
    width: .3px;
    background: rgba(0, 0, 0, .5);
  }
</style>
