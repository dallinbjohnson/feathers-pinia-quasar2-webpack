<template>
  <q-drawer ref="drawer"
            :mini="miniState"
            :value="value"
            @input="$emit('input', $event)"
            :side="side"
            bordered
            @on-layout="handleLayout"
            :mini-to-overlay="miniToOverlay"
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut">
    <div class="fit" style="display: flex; flex-flow: column; flex-shrink: 0;">
      <!-- "height: 100px;" seem to address issue with flex: 1 1 auto scroll area on safari -->
      <q-scroll-area style="height: 100px; flex: 1 1 auto; width: 100%;">
        <slot name="menu"></slot>
      </q-scroll-area>
      <!-- Mini toggle is not needed if below breakpoint -->
      <div v-if="hasMiniToggle" class="ub-row ub-box-fixed">
        <q-btn color="down1"
               :ripple="false"
               class="full-width"
               flat
               :icon="miniState ? 'chevron_right' : 'chevron_left'"
               size="md"
               @click="toggleMini"/>
      </div>
    </div>
  </q-drawer>
</template>

<script>
  export default {
    name: 'MenuDrawer',
    components: {},
    props: {
      value: {
        type: Boolean,
        default: true,
      },
      mini: {
        type: Boolean,
        default: true,
      },
      autoExpand: {
        type: Boolean,
        default: false,
      },
      side: {
        type: String,
        default: 'left',
      },
    },
    data: function () {
      return {
        miniState: this.mini,
        drawerBelowBreakpoint: false,
      };
    },
    computed: {
      miniToOverlay: function () {
        return this.autoExpand;
      },
      hasMiniToggle: function () {
        return !this.drawerBelowBreakpoint && !this.autoExpand;
      },
    },
    watch: {
      mini: function (val) {
        if (!this.autoExpand) {
          this.setMini(val);
        }
      },
      miniState: function (val) {
        this.$emit('update:mini', val);
      },
    },
    methods: {
      resize(delay) {
        this.$nextTick(() => {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, delay);
        });
      },
      handleLayout(state) {
        console.log(`handleLayout: ${state}`);
        this.drawerBelowBreakpoint = this.$refs.drawer.belowBreakpoint;
        this.resize(100);
      },
      toggleMini() {
        this.miniState = !this.miniState;
        this.resize(200);
      },
      setMini(mini) {
        this.miniState = mini;
        this.resize(200);
      },
      handleMouseOver() {
        if (this.autoExpand) {
          this.miniState = false;
        }
      },
      handleMouseOut() {
        if (this.autoExpand) {
          this.miniState = true;
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  /*
    ::-webkit-scrollbar {
      width: 12px;
    }

    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    }
   */
</style>
