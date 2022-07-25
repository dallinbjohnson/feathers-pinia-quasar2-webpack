<template>
  <div id="themePicker" class="flex flex-center q-pa-md">

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <color-picker v-model="color" path="theme_primary_color"></color-picker>
        </q-card-section>

        <q-card-actions>
          <q-space></q-space>
          <q-btn outline color="primary" @click="updatePofile">Update Theme</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div :class="show_buttons ? `row q-col-gutter-md` : ''" style="width: 100%;">
      <div v-if="show_buttons" class="col-12 col-sm-4 col-md-2">

        <div :class="`${$data.$windowWidth < 700 ? 'button-grid' : 'column'} q-col-gutter-md`">
          <div class="col-auto">
            <q-btn class="glossy full-width"
                   size="lg"
                   @click="handleClearTheme">
              Clear <br/> Theme
            </q-btn>
          </div>
          <div v-for="(card, index) in color_cards" :key="index" class="col-auto">
            <q-btn class="glossy full-width"
                   :color="card.scss_name"
                   size="lg"
                   :text-color="`${$getTextColor(card.css_name)}`"
                   @click="handleColorBtn(card)">
              {{ card.title }} <br>
              {{ $getCssVar(card.css_name) }}
            </q-btn>
          </div>
        </div>

      </div>

      <div :class="show_buttons ? `col-12 col-sm-8 col-md-10` : ''">

        <q-card>
          <layout :container="true" style="min-height: 650px">
<!--            <q-page class="q-pa-md">-->
<!--              <div class="fit row wrap justify-center items-center content-start q-col-gutter-md">-->
<!--                <div>-->
<!--                  <q-card class="cursor-pointer"-->
<!--                          style="width: 200px;"-->
<!--                          @click="handleClearTheme">-->
<!--                    <q-card-section>-->
<!--                      <h3 class="q-ma-none" style="margin-bottom: 45px;">Clear Theme</h3>-->
<!--                      <p>-->
<!--                        Lorem ipsum dolor sit amet consectetur adipisicing elit.-->
<!--                      </p>-->
<!--                    </q-card-section>-->
<!--                  </q-card>-->
<!--                </div>-->
<!--                <div v-for="(card, index) in color_cards" :key="index">-->
<!--                  <q-card :class="`${card.background} cursor-pointer`"-->
<!--                          :style="`width: 200px; color: ${$getTextColor(card.css_name)}`"-->
<!--                          @click="handleColorBtn(card)">-->
<!--                    <q-card-section>-->
<!--                      <h3>{{ card.title }}</h3>-->
<!--                      {{ $getCssVar(card.css_name) }}-->
<!--                      <p>-->
<!--                        Lorem ipsum dolor sit amet consectetur adipisicing elit.-->
<!--                      </p>-->
<!--                    </q-card-section>-->
<!--                  </q-card>-->
<!--                </div>-->
<!--              </div>-->
<!--            </q-page>-->
            <PageIndex />
          </layout>
        </q-card>

      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  import colorPicker from '@iy4u/form-gen-client-lib/src/components/common/atoms/ColorSelectorRoundInput/ColorSelectorRoundInput.vue';

  export default {
    name: 'themePicker',
    props: {
      show_buttons: {
        type: Boolean,
        default: true,
      },
    },
    components: {
      colorPicker,
    },
    beforeCreate() {
      this.$options.components.layout = require('layouts/MainLayout.vue').default;
      this.$options.components.PageIndex = require('pages/Index.vue').default;
    },
    data() {
      return {
        // theme picker
        drawerLeft: false,
        dialog: false,
        current_color_card: null,
        color_cards: [
          {
            title: 'Primary',
            background: 'bg-primary',
            scss_name: 'primary',
            css_name: '--q-color-primary',
          },
          {
            title: 'Secondary',
            background: 'bg-secondary',
            scss_name: 'secondary',
            css_name: '--q-color-secondary',
          },
          {
            title: 'Accent',
            background: 'bg-accent',
            scss_name: 'accent',
            css_name: '--q-color-accent',
          },
          {
            title: 'Dark',
            background: 'bg-dark',
            scss_name: 'dark',
            css_name: '--q-color-dark',
          },
          {
            title: 'Positive',
            background: 'bg-positive',
            scss_name: 'positive',
            css_name: '--q-color-positive',
          },
          {
            title: 'Negative',
            background: 'bg-negative',
            scss_name: 'negative',
            css_name: '--q-color-negative',
          },
          {
            title: 'Info',
            background: 'bg-info',
            scss_name: 'info',
            css_name: '--q-color-info',
          },
          {
            title: 'Warning',
            background: 'bg-warning',
            scss_name: 'warning',
            css_name: '--q-color-warning',
          },
        ],

        user: null,
        color: {
          hue: 0,
          alpha: 1,
          hex: '#FF0000',
          hexa: '#FF0000',
          hsla: {
            h: 0,
            s: 1,
            l: 0.5,
            a: 1,
          },
          hsva: {
            h: 0,
            s: 100,
            v: 100,
            a: 1,
          },
          rgba: {
            r: 255,
            g: 0,
            b: 0,
            a: 1,
          },
        },
      };
    },
    watch: {
      stateUser: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (!this.$lisNil(newVal) && !this.$lisEmpty(newVal)) {
            this.user = newVal.clone();
          }
          this.color_cards = this.color_cards.splice(0);
        },
      },
    },
    computed: {
      ...mapGetters('auth', {
        stateUser: 'user',
      }),
    },
    methods: {
      handleColorBtn(card) {
        this.current_color_card = card;
        this.color = this.$getCssVar(card.css_name);
        console.log('$getTextColor', this.$getCssVar(card.css_name));
        this.dialog = true;
      },
      handleClearTheme() {
        let unset_theme = {};
        let theme = this.$lget(this.user, 'theme', {});
        Object.keys(theme).forEach(k => {
          if (k.startsWith('--')) {
            this.$lset(unset_theme, ['$unset', `theme.${k}`], 1);
          }
        });
        if (this.$lget(this.user, 'theme.darkMode', false) !== false) this.$lset(unset_theme, ['theme.darkMode'], false);
        if (Object.keys(unset_theme).length) {
          this.user.patch({data: unset_theme})
            .then(res => {
              this.current_color_card = null;
              this.dialog = false;

              this.$q.notify({
                type: 'positive',
                message: `Successfully Cleared "${res.email}" Theme`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: err.message,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            });
        }
      },
      updatePofile() {
        let payload = {};
        this.$lset(payload, [`theme.${this.current_color_card.css_name}`], this.color.hexa);

        if (Object.keys(payload).length) {
          this.user.patch({data: payload})
            .then(res => {
              this.current_color_card = null;
              this.dialog = false;

              this.$q.notify({
                type: 'positive',
                message: `Successfully Updated "${res.email}" Theme`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: err.message,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            });
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_themePicker.scss">
</style>
