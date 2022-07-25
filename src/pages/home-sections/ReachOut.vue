<template>
  <div id="ReachOut" class="__reach_out">
    <div class="row">
      <div :class="`col-12 col-md-6 text-${textColor} q-pa-md`">
        <div class="row justify-center justify-md-end">
          <div style="width: 600px; max-width: 100%; padding: 0 1vw;">
            <div class="text-xxl text-mb-xxl font-2">{{ title }}</div>
            <q-separator class="q-my-sm"></q-separator>
            <div class="text-md text-mb-md">{{ caption }}
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 q-pa-md">
        <contact-form></contact-form>
      </div>
    </div>
  </div>
</template>

<script>
  import ContactForm from '../../components/common/atoms/contact/ContactForm';

  export default {
    name: 'ReachOut',
    components: { ContactForm },
    mixins: [],
    props: {
      title: { type: String, default: 'Nearly every website on the internet has this section' },
      caption: {
        type: String,
        default: 'but, we mean it more than they do. We are building something fantastic, and  we are still in the phase where we\'re gathering friends to build with us. So reach out.'
      },
      textColor: { type: String, default: 'primary' }
    },

    computed: {},
    methods: {}
  };
</script>

<style scoped lang="scss">
  .__reach_out {
    width: 100%;
    padding: 12vh 0;
    background: var(--q-color-accent);
  }

  .__strip {
    width: 100%;
    background: var(--q-color-secondary);
    //background: linear-gradient(12deg, var(--q-color-primary), var(--q-color-secondary));
    height: 13px;
    border-radius: 5px;
    margin: 4px 0;
  }
</style>
