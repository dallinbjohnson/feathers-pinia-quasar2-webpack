<template>
  <div class="__contact-footer">
    <div class="row justify-center">
      <div class="col-12 col-md-6">
        <div class="row justify-center items-center">
          <slot name="left"></slot>
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="row justify-center full-height items-center font-2 q-py-md">
          <contact-strip
            :btnAttrs="{ dense: false, size: 'md' }"
            :sms-attrs="{ color: 'primary' }"
            :phone-attrs="{ color: 'primary' }"
            :email-attrs="{ color: 'primary' }"
            :value="contact"
            :video="false"
            phone-path="phone"
            email-path="email"
            sms-path="phone"
          ></contact-strip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ContactStrip from 'components/common/atoms/contact/ContactStrip';
  export default {
    components: { ContactStrip },
    props: {
      contact: Object
    },
    computed: {

    }
  };
</script>

<style scoped lang="scss">
  .__contact-footer {
    width: 100%;
    padding: 60px 0;
    background: var(--q-color-accent);
    border-top: solid .2px rgba(0,0,0,.4)
  }
</style>
