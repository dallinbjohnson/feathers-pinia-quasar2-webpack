
<template>
  <q-dialog
    id="dia"
    v-bind="$attrs"
    transition-hide="fade"
    transition-show="fade"
    :seamless="!maxed"
    :no-backdrop-dismiss="!maxed"
    :value="value"
    @input="$emit('input',$event)"
  >
    <q-card
      square
      :style="
      `
      ${!maxed?
      'position:absolute; right: 0; bottom: 0;':
      'margin: 50vh auto 0;\n'+
'  transform: translateY(-50%);'
      }
       ${($q.screen.sm || $q.screen.xs)?'min-width:100%':`${minimized?'min-width:20rem;': 'min-width:50rem;'}`}
       `
      ">
      <q-bar class="q-pa-lg">
        <div class="text-h6">{{title}}</div>

        <q-space/>

        <q-btn-group class="q-gutter-sm" flat>
          <q-btn @click="minimize" v-if="!minimized"  class="gt-sm" size="sm" dense flat icon="fas fa-minus">
            <q-tooltip>Minimize</q-tooltip>
          </q-btn>
          <q-btn @click="minimized=false" v-else class="gt-sm" size="sm" dense flat icon="fas fa-minus">
            <q-tooltip>Maximize</q-tooltip>
          </q-btn>
          <q-btn class="gt-sm" v-if="maxed" size="sm" dense flat icon="fas fa-compress-alt"  @click="maxed=false">
            <q-tooltip>Exit Full Screen (Shift for popout)</q-tooltip>
          </q-btn>
          <q-btn  class="gt-sm" v-else size="sm" dense flat icon="fas fa-expand-alt"  @click="maximize">
            <q-tooltip>Full Screen (Shift for pop-out)</q-tooltip>
          </q-btn>
          <q-btn size="sm" dense flat icon="close" v-close-popup @click="close">
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-btn-group>
      </q-bar>
      <q-card-section
        v-if="!minimized"
        :style="`${($q.screen.sm || $q.screen.xs)?'':'min-height:50vh'}`"
        :class="{'dia-mob':($q.screen.sm || $q.screen.xs)}"
      >

          <slot>

          </slot>


      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  export default {
    name: 'inbox-dialog',
    props: {
      value: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: 'New Message'
      }
    },
    data() {
      return {
        maxed: false,
        minimized: false,
        placeholder: {
          to: 'Recipients: ',
        },
        message: {
          to: '',
          subject: '',
          body: '',
        },
      };
    },
    methods: {
      saveWork() {
        this.$q.notify({
          message: 'Saved your text to local storage',
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
        });
      },
      uploadIt() {
        this.$q.notify({
          message: 'Server unavailable. Check connectivity.',
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
        });
      },
      minimize(){
        this.minimized=true;
        this.maxed=false;
      },
      maximize(){
        this.minimized=false;
        this.maxed=true;
      },
      close(){
        this.minimized=false;
        this.maxed=false;
        this.$emit('close');
      },
    },
  };
</script>


<style lang="scss" scoped>
  .dia{

    .q-dialog__inner {
      position: relative;
      overflow-x: hidden !important;
    }
  }
.dia-mob{
  min-height:75vh;
}
</style>
