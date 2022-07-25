<template>
  <div id="pricing_main" class="__pricing font-2">
    <simple-funnel
      :value="activeValue"
    ></simple-funnel>
  </div>
</template>

<script>
  import SimpleFunnel from 'components/simple-funnels';

  export default {
    name: 'Pricing',
    components: {
      SimpleFunnel
    },
    data() {
      return {
        active: 'how-to-build',
        done: false
      };
    },
    computed: {
      activeValue() {
        if (this.active) return this.schema.find(a => a._id === this.active);
        else return undefined;
      },
      schema() {
        return [
          {
            _id: 'how-to-build',
            title: 'How would you like to build with us?',
            component: () => import('../../components/simple-funnels/forms/BlockSelect'),
            attrs: {
              options: [
                {
                  label: 'node',
                  caption: 'Sign up, get paid',
                  img: require('../../assets/icons/easy.png'),
                  imgAttrs: { style: 'height: 100px; width: 100px;'}
                },
                {
                  label: 'partner',
                  caption: 'Own your own store',
                  img: require('../../assets/icons/cards.png'),
                  imgAttrs: { style: 'height: 100px; width: 100px;'}
                },
                {
                  label: 'investor',
                  caption: 'Buy in to the machine',
                  img: require('../../assets/icons/pie_pieces.png'),
                  imgAttrs: { style: 'height: 100px; width: 100px;'}
                }
              ]
            }
          },
          {}
        ];
      }
    },
    methods: {
      handleInput(val) {
        if (val.component) {
          this.active = Object.assign({}, val);
        } else {
          this.done = true;
          this.active = {};
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__pricing {
    width: 100%;
    padding: 9vw 0 12vw 0;
  }
</style>
