<template>
  <q-dialog v-bind="$attrs">
    <q-card class="q-dialog-plugin q-pa-md text-center">
      <!--
        ...content
        ... use q-card-section for it?
      -->

      <q-img v-if="!loading" src="~assets/plaid.png" alt="plaid"/>

      <q-spinner-grid v-else color="primary" size="xl"/>

      <q-card-section v-if="!loading" class="text-caption">
        <slot name="custom-message">

        </slot>
        Together with plaid, we make it easy for you to connect to your bank
      </q-card-section>
      <q-card-section v-else class="text-caption">
        Finalizing ...
      </q-card-section>
      <!-- buttons example -->
      <q-card-actions align="between">
        <q-btn :disabled="loading" @click="$emit('clear')" color="light" text-color="primary" outline label="Cancel"/>
        <plaid-link
          :clientName="$authUser&&$authUser.email"
          :env="environment"
          :link_token="linkToken"
          :products="products"
          webhook="https://requestb.in"
          :onSuccess="onSuccess"
          :onExit="onExit"
        >
          <q-btn :disabled="loading" color="primary" label="connect"/>
        </plaid-link>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
  import PlaidLink from 'vue-plaid-link2';
  // import {loadStripe} from '@stripe/stripe-js';

  export default {
    name: 'plaid-prompt-dialog',
    components: {PlaidLink},
    props: {
      linkToken: {
        type: String,
        required: true,
      },
      environment: {
        type: String,
        required: true,
      },
      products: {
        type: Array,
        default() {
          return ['auth'];
        },
      },
      data_to_tokenize: {
        type: Object,
        required: true,
      },
      stripe_publishable: {
        type: String,
        required: false,
      },
    },
    data() {
      return {
        loading: false,
      };
    },
    async mounted() {
      // this.stripe = await loadStripe(this.stripe_publishable);
    },
    methods: {
      async onSuccess(token, metadata) {
        try {
          this.loading = true;
          this.$emit('verified', {token,metadata});
          this.loading = false;
          this.$emit('clear');
        } catch (e) {
          this.$q.notify({
            type: 'negative',
            message: `Error on access token processing: ${e.message}.`,
          });
          this.loading = false;
          this.$emit('clear');
        }
      },
      onExit(err, metadata) {
        console.log(err);
        console.log(metadata);
        this.$q.notify({
          type: 'negative',
          message: 'Error initializing plaid connection.',
        });
        this.loading = false;
        this.$emit('clear');
      },
    },
  };
</script>
