<template>
  <q-dialog id="LayoutDialog"
            :value="value"
            @input="$emit('input', $event)"
            :position="dialog_position"
            :full-height="dialog_position === 'right'"
            :seamless="dialog_position === 'right'">
    <q-layout view="Lhh LpR Lff"
              container
              class="bg-white"
              :style="layoutStyles">
      <q-header class="bg-primary" :style="headerStyles">
        <q-toolbar>
          <q-btn flat
                 round
                 dense
                 icon="menu"
                 @click="drawer = !drawer"/>
          <q-btn flat
                 round
                 dense
                 :icon="dialog_position !== 'right' ? 'fas fa-thumbtack' : 'fas fa-expand-alt'"
                 @click="handleDialogPosition"/>
          <q-toolbar-title>{{ title }}</q-toolbar-title>
          <q-btn flat v-close-popup round dense icon="close"/>
        </q-toolbar>
      </q-header>

      <q-drawer bordered v-model="drawer"
                :width="$data.$windowWidth < 420 ? $data.$windowWidth - 25 : 350"
                content-class="shadow-1"
                class="popout-side-drawer"
                :breakpoint="100"
                persistent
                overlay>
        <q-page-sticky position="top-right" :offset="[5, -45]" style="z-index: 100;">
          <q-btn @click="drawer = false" flat dense round icon="close"></q-btn>
        </q-page-sticky>

        <slot name="drawer"></slot>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-sm">
          <slot></slot>
        </q-page>
      </q-page-container>

      <q-footer class="bg-white text-black" bordered :style="footerStyles">
        <q-toolbar>
          <slot name="footer-toolbar">
            <q-btn color="primary" @click="$emit('save')">Save</q-btn>
          </slot>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </q-dialog>
</template>

<script>
  export default {
    name: 'LayoutDialog',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
      },
    },
    data() {
      return {
        drawer: false,
        dialog_position: 'right',
      };
    },
    watch: {
      '$data.$windowWidth': {
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal) {
          if (this.value) {
            this.handleCommentDrawerStyle();
          }
        },
      },
      drawer: {
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal) {
          if (this.value) {
            this.handleCommentDrawerStyle();
          }
        },
      },
    },
    computed: {
      layoutStyles() {
        let styles = 'overflow: visible !important;';

        if (this.dialog_position === 'right') {
          styles += `width: ${this.$data.$windowWidth < 420 ? this.$data.$windowWidth - 10 : 400}px;`;
        }
        return styles;
      },
      headerStyles() {
        let styles = '';

        if (this.dialog_position === 'right') {
          styles += 'border-top-left-radius: 0.8em;';
        } else {
          styles += 'border-top-left-radius: 0.8em; border-top-right-radius: 0.8em;';
        }
        return styles;
      },
      footerStyles() {
        let styles = '';

        if (this.dialog_position === 'right') {
          styles += 'border-bottom-left-radius: 0.8em;';
        } else {
          styles += 'border-bottom-left-radius: 0.8em; border-bottom-right-radius: 0.8em;';
        }
        return styles;
      },
    },
    methods: {
      handleCommentDrawerStyle() {
        let drawers = document.querySelectorAll('.popout-side-drawer .q-drawer') || [];
        if (drawers.length && this.$data.$windowWidth > 755 && this.dialog_position === 'right') {
          drawers.forEach(drawer => drawer.style.marginLeft = '-350px');
        } else if (drawers.length && this.$data.$windowWidth > 1270 && this.dialog_position === 'standard') {
          drawers.forEach(drawer => drawer.style.marginLeft = '-350px');
        } else if (drawers.length !== 0) {
          drawers.forEach(drawer => drawer.style.marginLeft = '0px');
        }
      },
      handleDialogPosition() {
        this.dialog_position = this.dialog_position === 'right' ? 'standard' : 'right';
      },
    },
  };
</script>

<style scoped lang="scss">
  #cardFormDialog {

  }
</style>
