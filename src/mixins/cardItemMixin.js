// eslint-disable-next-line no-unused-vars
import {mapActions} from 'vuex';

// eslint-disable-next-line no-unused-vars
export default function cardItemMixin(options = {}) {

  let mixin = {
    methods: {
      ...mapActions('cards', {
        removeCard: 'remove',
      }),
      deleteCard(card) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to remove "${card.name}"?`,
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: true,
          persistent: true
        }).onOk(() => {
          this.removeCard(card._id)
            .then(result => {
              this.$q.notify({
                type: 'positive',
                message: `Successfully removed "${result.name}"`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    }
                  }
                ]
              });
            })
            .catch(error => {
              this.$q.notify({
                type: 'negative',
                message: error.message,
                timeout: 30000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    }
                  }
                ]
              });
            });
        });
      },
      clipboardSuccessHandler(e) {
        this.$q.notify({
          type: 'positive',
          message: `Successfully copied "${e.text}"`,
          timeout: 10000,
          actions: [
            {
              icon: 'close', color: 'white', handler: () => {
                /* ... */
              }
            }
          ]
        });
      },
      // eslint-disable-next-line no-unused-vars
      clipboardErrorHandler(e) {
        this.$q.notify({
          type: 'negative',
          message: e,
          timeout: 30000,
          actions: [
            {
              icon: 'close', color: 'white', handler: () => {
                /* ... */
              }
            }
          ]
        });
      },
      // eslint-disable-next-line no-unused-vars
      handleCopyMobile(value) {
        let self = this;
        this.$copyText(value).then(function (e) {
          self.$q.notify({
            type: 'positive',
            message: `Successfully copied "${e.text}"`,
            timeout: 10000,
            actions: [
              {
                icon: 'close', color: 'white', handler: () => {
                  /* ... */
                }
              }
            ]
          });
          console.log('Copied', e);
        }, function (e) {
          self.$q.notify({
            type: 'negative',
            message: 'Could not Copy. Try again!',
            timeout: 30000,
            actions: [
              {
                icon: 'close', color: 'white', handler: () => {
                  /* ... */
                }
              }
            ]
          });
          console.log('not Copied', e);
        });
      },
    }
  };

  return mixin;
}
