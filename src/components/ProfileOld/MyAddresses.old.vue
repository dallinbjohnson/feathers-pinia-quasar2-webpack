<template>
  <div>
    <div class="my-addresses">
      <div class="box-wrapper">
        <div @click="newAddressDio = true" class="box new-address"
             :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : ''}">
          <q-icon name="r_add_location_alt" style="font-size: clamp(40px, 10vw, 75px)"/>
<!--          <span class="material-icons-round">add_location_alt</span>-->
          <div class="text-center q-px-sm" style="font-size: clamp(15px, 5vw, 25px)">Add New Address</div>
        </div>
        <div @click="selectAddress(address)" class="box address"
             v-for="(address, idx) of $lget(accountData, 'account.addresses')" :key="idx"
             :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : ''}">
          <q-icon @click="removeAddress(address)" name="far fa-trash-alt" color="red" class="delete">
            <q-tooltip>Remove address</q-tooltip>
          </q-icon>
          <div class="name">{{ address.name ? address.name : 'No name' }}</div>
          <div class="flex">
            <div v-for="(type, index) in typesArray(address)" :key="index"
                 style="font-weight: bold; color: var(--q-color-primary); margin-right: 5px">
              {{ type }}{{ index !== typesArray(address).length - 1 ? ',' : '' }}
            </div>
          </div>
          <div class="address1">Street Address: {{ address.address1 }}</div>
          <div class="region">Region: {{ address.region }}</div>
          <div class="city">City: {{ address.city }}</div>
          <div class="postal">Postal Code: {{ address.postal.replace('-undefined', '') }}</div>
          <div class="country">Country: {{ address.country }}</div>
          <div v-for="(type, index) in typesArray(address)" :key="index">
            <div class="flex items-center">
              <q-spinner v-if="checkIsLoading(address._id, type)" class="q-mt-sm" color="primary" size="1.5em"/>
              <q-checkbox
                v-else
                @input="checkDefaults(address, type)"
                v-model="address.tags[`isDefault${type}`]"
                dense/>
              <p class="q-ma-none" style="margin-left: 5px">Default {{ type }} Address</p>
            </div>
          </div>
        </div>
      </div>

      <q-dialog v-model="newAddressDio">
        <q-card style="min-width: 50vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
          <q-card-section>
            <q-input label="Name" v-model="addressNameInput"/>
            <div class="flex justify-between q-mt-lg">
              <PlacesAutoCompleteBox style="flex: .7" :path="newAddress" @input="getAddress"/>
              <q-select
                label="Address Type(s)"
                v-model="addressTypes"
                :rules="[val => !!val || 'Select Type']"
                :options="['Shipping', 'Billing', 'Other']"
                style="flex: .25"
                multiple/>
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-mt-md">
            <q-btn label="Cancel" v-close-popup color="red"/>
            <q-btn label="Save Address" v-close-popup @click="saveAddress" color="primary"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showAddressDio">
        <q-card style="min-width: 40vw;">
          <PlacesAutoCompleteBox :value="selectedAddress" :path="newAddress"/>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {mapActions} from 'vuex';
  import PlacesAutoCompleteBox from 'components/formGeneratorCustom/PlacesAutoCompleteBox/PlacesAutoCompleteBox';

  export default {
    name: 'MyAddressesOld',
    components: {
      PlacesAutoCompleteBox,
    },
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isLoading: false,
        currentAddressId: undefined,
        currentAddressType: undefined,
        newAddress: {},
        newAddressDio: false,
        addressNameInput: '',
        showAddressDio: false,
        selectedAddress: {},
        addressTypes: [],
        accountData: {
          account: new models.api.Accounts().clone(),
        },
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length) {
            this.accountData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    methods: {
      ...mapActions('accounts', {
        patchAccount: 'patch',
      }),
      getAddress(e) {
        this.newAddress = e;
      },
      saveAddress() {
        this.newAddress.name = this.addressNameInput;
        this.addressTypes.forEach(type => {
          this.$lset(this.newAddress, `type.${type.toLowerCase()}`, true);
        });
        this.patchAccount([this.accountData.account._id, {
          $push: {
            addresses: this.newAddress,
          },
        }]).then(() => this.$q.notify({
          message: 'Address Added!',
          color: 'positive',
        })).catch(err => {
          this.$q.notify({
            message: 'Something went wrong on our end, try refreshing',
            color: 'negative',
          });
          console.log('Error: ', err);
        });
        this.addressNameInput = '';
      },
      removeAddress(address) {
        this.patchAccount([this.accountData.account._id, {
          $pull: {
            addresses: address,
          },
        }]);
      },
      selectAddress(address) {
        this.selectedAddress = address;
        this.showAddressDio = true;
      },

      checkDefaults(address, type) {
        const lowerCaseType = type.toLowerCase();
        if (address.tags[`isDefault${type}`]) {
          this.setIsLoading(true, address._id, type);
          this.patchAccount([null, {
            [`addresses.$.tags.isDefault${type}`]: true,
          }, {
            query: {
              _id: this.accountData.account._id,
              'addresses._id': address._id,
            },
          }]).then(() => {
            this.setIsLoading(false, address._id, type);
            this.$lget(this.accountData, 'account.addresses').forEach(item => {
              if (item.type[lowerCaseType] === address.type[lowerCaseType] && item._id !== address._id) {
                this.$lset(item, 'tags.isDefault', false);
                this.patchAccount([null, {
                  [`addresses.$.tags.isDefault${type}`]: false,
                }, {
                  query: {
                    _id: this.accountData.account._id,
                    'addresses._id': item._id,
                  },
                }]).catch(err => {
                  this.$q.notify({
                    type: 'negative',
                    message: `Error: ${err}`,
                  });
                  this.setIsLoading(false, address._id, type);
                });
              }
            });
          }).catch(err => {
            this.$q.notify({
              type: 'negative',
              message: `Error: ${err}`,
            });
            console.log('this is error in checkDefaults: ', err);
            this.setIsLoading(false, address._id, type);
          });
        } else {
          this.setIsLoading(true, address._id, type);
          this.patchAccount([null, {
            [`addresses.$.tags.isDefault${type}`]: false,
          }, {
            query: {
              _id: this.accountData.account._id,
              'addresses._id': address._id,
            },
          }]).then(() => {
            this.setIsLoading(false, address._id, type);
          }).catch(err => {
            this.$q.notify({
              type: 'negative',
              message: `Error: ${err}`,
            });
            this.setIsLoading(false, address._id, type);
          });
        }
      },

      setIsLoading(val, id, type) {
        this.currentAddressId = id;
        this.currentAddressType = type;
        val ? this.isLoading = true : this.isLoading = false;
      },
      checkIsLoading(id, type) {
        if (this.isLoading) {
          return (id === this.currentAddressId && type === this.currentAddressType);
        }
      },

      typesArray(address) {
        let arr = [];
        for (const key in address.type) {
          if (address.type[key]) {
            const newKey = key[0].toUpperCase() + key.slice(1);
            arr.push(newKey);
          }
        }
        return arr;
      },
    },
  };
</script>

<style scoped lang="scss">
.box-wrapper {
  padding: 20px 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  justify-items: center;

  .box {
    width: 95%;
    max-height: 40vh;
    min-height: 29vh;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.25);
    transition: 0.2s all;
  }

  .box:hover {
    background-color: #edeff3;
    transform: scale(1.05);
    cursor: pointer;
  }

  .new-address {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }

  .address {
    overflow-y: scroll;
    padding: 10px;
    position: relative;

    div:not(.name) {
      margin: 6px 0;
    }

    .delete {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
      font-size: 1.3em;
    }

    .name {
      font-size: 1.4em;
      font-weight: 500;
      margin-bottom: 8px;
    }
  }

  .address::-webkit-scrollbar {
    display: none;
  }
}

@media screen and (max-width: 1500px) {
  .box-wrapper {
    grid-template-columns: 1fr 1fr;

  }
}

@media screen and (max-width: 800px) {
  .box-wrapper {
    grid-template-columns: 1fr;
    padding: 20px 0;
  }

  .box {
    max-height: unset !important;
  }
}
</style>
