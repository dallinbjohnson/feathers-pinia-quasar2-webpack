<template>
  <div>
    <div v-if="!owners.length" class="text-center q-ma-lg" style="font-size: 20px">
      No Owners
    </div>

    <q-list v-else bordered separator>
      <q-item v-for="(owner, index) in owners"
              :key="index"
              class="q-my-sm">
        <q-item-section avatar>
          <q-avatar square color="accent" text-color="white">
            <img v-if="$lget(owner, 'avatar.raw.file')" :src="$lget(owner, 'avatar.raw.file')">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ owner.name }}</q-item-label>
          <q-item-label caption lines="1">{{ owner.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-spinner v-if="isDeleting"/>
          <q-icon v-else
                  size="xs"
                  name="fas fa-trash"
                  color="negative"
                  class="cursor-pointer"
                  @click="removeOwner(owner._id)"/>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="flex justify-center q-ma-md">
      <q-btn icon="sp:add_ownerIcon"
             label="Add Owner"
             @click="newOwnerDialog = true"/>

    </div>

    <q-dialog v-model="newOwnerDialog">
      <q-card style="min-width: 30vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
        <account-search v-model="accountSelection"
                        :filter-out="[account._id, ...ownerIds]"></account-search>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn label="Cancel" v-close-popup color="red"/>
          <q-btn label="Add"
                 :disable="accountSelection === null || accountSelection === []"
                 color="primary"
                 @click="addOwner"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import AccountSearch from 'components/profile/ProfileOld/AccountSearch';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'OwnersOld',
    components: {
      AccountSearch,
    },
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'accounts',
        name: 'owners',
        infinite: true,
        query() {
          return {
            _id: {
              $in: this.ownerIds,
            },
            $select: ['_id', 'name', 'email', 'avatar'],
          };
        },
        params() {
          return {
            qid: `accountOwners-${this.$lget(this.account, '_id')}`,
          };
        }
      }),
    ],
    data() {
      return {
        accountData: {
          account: new models.api.Accounts().clone(),
        },
        newOwnerDialog: false,
        isDeleting: false,
        isAdding: false,
        accountSelection: null,
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && Object.keys(newVal).length && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.accountData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    computed: {
      account() {
        return this.$lget(this.accountData, 'account', {});
      },
      ownerIds() {
        return this.$lget(this.account, 'ownership.owners', []).map(i => i.id);
      }
    },
    methods: {
      addOwner() {
        if (this.accountSelection !== null) {
          this.isAdding = true;

          // if the owners array doesn't exist on the account, this adds it
          if (!this.$lget(this.accountData, 'account.ownership.owners')) {
            this.$lset(this.accountData, 'account.ownership.owners', []);
          }

          this.$lget(this.accountData, 'account.ownership.owners', []).push({id: this.accountSelection._id});
          this.$lget(this.accountData, 'account').patch({
            data: {
              'ownership.owners': this.$lget(this.accountData, 'account.ownership.owners'),
            }
          })
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Successfully added owner',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              this.isAdding = false;
              this.newOwnerDialog = false;
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
      removeOwner(accountId) {
        this.isDeleting = true;
        let newOwners = this.$lget(this.accountData, 'account.ownership.owners', []).filter(obj => {
          return obj.id !== accountId;
        });
        this.$lset(this.accountData, 'account.ownership.owners', newOwners);
        this.$lget(this.accountData, 'account').patch({
          data: {
            'ownership.owners': this.$lget(this.accountData, 'account.ownership.owners'),
          }
        })
          .then(() => {
            this.$q.notify({
              type: 'positive',
              message: 'Successfully removed owner',
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
            this.isDeleting = false;
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
      },
    },
  };
</script>

<style scoped>

</style>
