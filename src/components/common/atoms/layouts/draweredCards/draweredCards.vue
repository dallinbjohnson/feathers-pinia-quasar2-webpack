<template>
    <q-layout id="drawered-cards" view="hHh LpR fff" container class="shadow-1" :style="{height: 'calc(100vh - 110px)', 'border-radius': '.8em', ...layoutStyles}">
      <q-header>
        <q-toolbar>
          <slot name="toolbar">
            <q-btn class="q-ml-lg" flat round dense @click="leftDrawer = !leftDrawer">
              <q-icon :name="toolbarIcons" />
            </q-btn>
            <q-toolbar-title>
              {{title}}
            </q-toolbar-title>

            <q-btn v-if="right" class="q-mr-lg" flat round dense @click="rightDrawer = !rightDrawer">
              <q-icon :name="toolbarIcons" />
            </q-btn>
          </slot>
        </q-toolbar>
      </q-header>

      <q-drawer v-if="left" v-model="leftDrawer" show-if-above class="sideDrawer" side="left">
        <div class="q-py-sm" style="height: 99%;">
          <q-card v-if="$q.screen.gt.sm" class="q-mr-xs q-ml-md" style="height: 100%">
            <q-scroll-area class="fit">
              <slot name="leftDrawer"></slot>
            </q-scroll-area>
          </q-card>
          <q-scroll-area v-else class="fit">
            <slot name="leftDrawer"></slot>
          </q-scroll-area>
        </div>
      </q-drawer>

      <q-drawer v-if="right" v-model="rightDrawer" show-if-above class="sideDrawer" side="right">
        <div class="q-py-sm" style="height: 99%;">
          <q-card class="q-ml-xs q-mr-md" style="height: 100%">
            <q-scroll-area class="fit">
              <slot name="rightDrawer"></slot>
            </q-scroll-area>
          </q-card>
        </div>
      </q-drawer>

      <q-page-container>
        <q-page :class="['flex', 'column', 'q-pb-md', 'q-pt-sm', {'q-px-md': leftDrawer}]">
          <div class="flex column" style="flex: 1; width: 100%">
            <q-card style="flex: 1; width: 100%">
              <slot></slot>
            </q-card>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
</template>

<script>


  export default {
    name: 'DraweredCards',
    props: {
      title: {
        type: String
      },
      toolbarIcons: {
        type: String,
        default: 'menu'
      },
      left: {
        type: Boolean,
        default: true
      },
      right: {
        type: Boolean,
        default: false
      },
      layoutStyles: {
        type: Object
      }
    },
    data() {
      return {
        leftDrawer: true,
        rightDrawer: false,
      };
    },
  };
</script>

<style scoped lang="scss" src="./_draweredCards.scss">

</style>
