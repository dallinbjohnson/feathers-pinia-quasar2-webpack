<template>
  <q-page>

    <template v-for="(section, i) in sections">
      <div :key="`section-${i}`" v-bind="{ class: 'full-width', ...section.divAttrs }" :id="`page-${$lget(section, 'id', i)}`">
        <component :is="section.component" v-bind="section.attrs" v-on="eventHandler()"></component>
      </div>
    </template>
    <common-dialog v-model="bookDialog">
      <div class="text-sm text-mb-sm text-weight-bold">Let's do this</div>
      <q-separator class="q-my-md"></q-separator>
      <div class="row justify-center">
      <contact-form @input="bookDialog =false"></contact-form>
      </div>
    </common-dialog>
  </q-page>
</template>

<script>
  import CommonDialog from 'components/common/atoms/dialogs/CommonDialog';
  import ContactForm from 'components/common/atoms/contact/ContactForm';
  export default {
    name: 'HomePage',
    components: { ContactForm, CommonDialog },
    data(){
      return {
        bookDialog: false
      };
    },
    computed: {
      sections() {
        const imgAttrs =  {
          style: 'height: 60px;',
          contain: true
        };
        return [
          {
            id: 'Top',
            component: () => import('./home-sections/VideoTop'),
            attrs: {},
            divAttrs: {}
          },
          {
            id: 'Services',
            component: () => import('./home-sections/Services'),
            attrs: {
              divAttrs: {
                class: '__services font-2'
              },
              title: 'Our Services',
              services: [
                {
                  img: {
                    src: require('../assets/icons/dropship.png'),
                    ...imgAttrs
                  },
                  subtitle: 'automated',
                  title: 'Dropship',
                  caption: 'Pay for inventory only after it\'s sold and delivered. A turn key solution for investing in e-commerce'
                },
                {
                  img: {
                    src: require('../assets/icons/cargo_ship.png'),
                    ...imgAttrs
                  },
                  subtitle: 'automated',
                  title: 'Wholesale',
                  caption: 'E-commerce has layers and layers of demand. Instead of fussing with consumers, we can help you find demand channels for other businesses.'
                },
                {
                  img: {
                    src: require('../assets/icons/arbitrage.png'),
                    ...imgAttrs
                  },
                  subtitle: 'automated',
                  title: 'Arbitrage',
                  caption: 'With all the activity and options involved in selling online, we can find pricing inefficiencies, re-align the options, and you take home the profits. No inventory, no logistics, no mess.'
                }
              ]
            },
            divAttrs: {}
          },
          {
            id: 'Choose',
            component: () => import('./home-sections/ChooseType'),
            attrs: {},
            divAttrs: {}
          },
          {
            id: 'Sparks',
            component: () => import('./home-sections/Sparks'),
            attrs: {},
            divAttrs: {}
          },
          {
            id: 'Contact',
            component: () => import('./home-sections/ReachOut'),
            attrs: {
              title: 'Book a call with us so we can help you find the right fit',
              caption: 'This is not \'one-size-fits-all\' solution and we will spend the time finding the best solution for you. Our job is to make your job easier. A lot easier.'
            },
            divAttrs: {}
          }
        ];
      }
    },
    methods: {
      eventHandler(){
        const events = {
          start: () => {
            window.scrollTo({
              top: document.getElementById('ReachOut').offsetTop,
              behavior: 'smooth'
            });
          },
          open: () => {
            this.bookDialog = true;
          }
        };
        return events;
      }
    }
  };
</script>

<style scoped>

</style>
