<template>
  <div class="relative-position q-mr-sm"
       style="height: 35px; display: flex; align-items: center; border-radius: 5px"
  >
    <q-btn icon="save"
           size="13pt"
           :color="!saved ? 'positive' : 'grey'"
           round
           dense
           @click.stop="manualSave"
           flat
    >
      <q-tooltip content-style="font-size:10pt">{{!saved ? 'Save' : 'No Changes'}}</q-tooltip>
    </q-btn>
    <q-btn flat
           icon="settings"
           size="13pt"
           round
           color="grey"
           dense
           @click.stop="saveSettingsDio = !saveSettingsDio"
    >
      <q-tooltip v-if="!saveSettingsDio" content-style="font-size:10pt" >Save Settings</q-tooltip>
    </q-btn>
    <q-menu v-model="saveSettingsDio" @input="$emit('saveSettingsDio', $event)" anchor="top middle" self="bottom middle" :offset="[0,3]">
      <div class="q-pa-xs flex column flex-center">
        <div style="display: flex; justify-content: center; align-items: center">
          <div style="color: var(--color-secondary-0); font-weight: bolder">
            AutoSave
          </div>
          <q-toggle v-model="autoSave" @input="toggleAutoSave" color="secondary" class="self-center"></q-toggle>

        </div>
        <q-btn-toggle v-model="dbounce"
                      @input="changeDebounce"
                      dense
                      rounded
                      no-caps
                      unelevated
                      toggle-color="secondary"
                      color="white"
                      text-color="secondary"
                      :style="`border: 1px solid ${$getCssVar('--q-color-secondary')}`"
                      :options="[
                      { value: 1000 * 15, slot: '15s' },
                      { value: 1000 * 30, slot: '30s' },
                      { value: 1000 * 60, slot: '1m' },
                      { value: 1000 * 60 * 5, slot: '5m' },
                      { value: 1000 * 60 * 15, slot: '15m' },
                      { value: 1000 * 60 * 30, slot: '30m' },
                      { value: 1000 * 60 * 60, slot: '1hr' },
                    ]">
          <template v-slot:15s>
            <div @mouseenter="autoSaveSettingsDuration = '15 Seconds'">15s</div>
          </template>
          <template v-slot:30s>
            <div @mouseenter="autoSaveSettingsDuration = '30 Seconds'">30s</div>
          </template>
          <template v-slot:1m>
            <div @mouseenter="autoSaveSettingsDuration = '1 Minute'">1m</div>
          </template>
          <template v-slot:5m>
            <div @mouseenter="autoSaveSettingsDuration = '5 Minutes'">5m</div>
          </template>
          <template v-slot:15m>
            <div @mouseenter="autoSaveSettingsDuration = '15 Minutes'">15m</div>
          </template>
          <template v-slot:30m>
            <div @mouseenter="autoSaveSettingsDuration = '30 Minutes'">30m</div>
          </template>
          <template v-slot:1hr>
            <div @mouseenter="autoSaveSettingsDuration = '1 hour'">1hr</div>
          </template>
          <q-tooltip content-style="font-size:10pt">AutoSave Frequency: {{autoSaveSettingsDuration}}</q-tooltip>
        </q-btn-toggle>
      </div>
    </q-menu>
  </div>
</template>
<script>
  import {mapGetters, mapState} from 'vuex';

  export default {
    name: 'auto-save',
    props: {
      page: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        autoSaveSettingsDuration:'',
        saveSettingsDio: false,
        dbounce: 15000,
        autoSave: true
      };
    },
    computed: {
      ...mapState({
        autoSaveDebounce: 'autoSaveDebounce',
        stateAutoSave: 'autoSave',
        saved: 'saved',
      }),
      ...mapGetters('auth', {user: 'user'})
    },
    watch: {
      autoSaveDebounce: {
        immediate: true,
        handler(newVal) {
          this.dbounce = newVal;
        }
      },
      stateAutoSave: {
        immediate: true,
        handler(newVal) {
          this.autoSave = newVal;
        }
      },
    },
    methods: {
      toggleAutoSave() {
        this.$store.dispatch('users/patch', [this.user._id, {'preferences.autoSave.value': this.autoSave}]);
      },
      manualSave() {
        if (!this.saved) {
          this.$store.dispatch('executeSave', {pageId: this.page._id, interval: 0, manualSave: true});
        }
      },
      changeDebounce() {
        this.$store.dispatch('users/patch', [this.user._id, {'preferences.autoSave.debounce': this.dbounce}]);
      },
    },
  };
</script>
