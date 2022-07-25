<template>
  <div id="MarginPaddingSelector">
    <div style="display: flex; align-items: center;">
      <p style="color: #404040; font-weight: bold">{{ $lupperFirst(styleName) }}</p>
      <q-space></q-space>
      <div class="q-mt-sm" style="display: flex;">
        <div class="inputBackground">
          <select v-model="itemOptionValue"
                  style="font-size: 14px; border: 0; outline: 0; height: 25px">
            <q-tooltip>
              Select {{ styleName }}
            </q-tooltip>
            <option v-for="itemOption in itemOptions"
                    :key="itemOption"
                    :value="itemOption">
              {{ itemOption }}
            </option>
          </select>
          <q-btn v-if="itemOptionValue !== styleName && items.length !== 4" flat round size="sm" icon="add"
                 @click="addItem"></q-btn>
        </div>
      </div>
    </div>
    <div v-if="items.length" class="row q-col-gutter-md q-mt-none">
      <div v-for="(item, index) in items"
           :key="index"
           :class="itemOptionValue === styleName ? 'col-6' : 'col-12'">
        <p v-if="itemOptionValue === styleName">{{ itemTitle(index) }}</p>
        <margin-padding-input v-model="item.value"
                              @input="saveItem(item, index, ...arguments)"
                              :item="item"
                              :listLength="items.length"
                              :listIndex="index"
                              :itemMode="itemOptionValue === styleName"
                              :itemKey="item.itemKey"
                              :itemTypes="itemTypes"
                              @removeItem="removeItem"></margin-padding-input>
      </div>
    </div>
    <div style="display: flex;">
      <q-space></q-space>
      <q-btn v-if="itemOptionValue === styleName && items.length !== 4" flat round size="sm" icon="add"
             @click="addItem"></q-btn>
    </div>
  </div>
</template>

<script>
  import MarginPaddingInput from './MarginPaddingInput';

  export default {
    name: 'MarginPaddingSelector',
    components: {
      MarginPaddingInput,
    },
    props: {
      element: Object,
      styleName: {
        type: String,
        default: 'margin',
      },
    },
    data() {
      return {
        itemOptionValue: this.styleName,
        itemOptions: [this.styleName, `${this.styleName}-top`, `${this.styleName}-right`, `${this.styleName}-bottom`, `${this.styleName}-left`],
        itemTypes: [`${this.styleName}-top`, `${this.styleName}-right`, `${this.styleName}-bottom`, `${this.styleName}-left`],
        items: [],
        elementData: {},
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.elementData = this.$lcloneDeep(newVal);
          }
        },
      },
      elementData: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.itemOptions = [this.styleName, `${this.styleName}-top`, `${this.styleName}-right`, `${this.styleName}-bottom`, `${this.styleName}-left`];
            this.items = [];
            this.itemTypes.forEach(itemKey => {
              let item_val = this.$lget(newVal, `styles.${itemKey}`);
              if (item_val) {
                // console.log('elementData > itemKey', `${itemKey}: ${item_val}`);
                this.items.push({itemKey: itemKey, value: item_val});
                this.itemOptions = this.itemOptions.filter(item => item !== itemKey);
              }
            });
            if (this.items.length && this.items.length < 4) {
              if (this.itemOptions.includes('all')) {
                this.itemOptions = this.itemOptions.filter(item => item !== 'all');
              }
              this.itemOptionValue = this.itemOptions[1];
            }

            if (this.items.length === 4 || (this.itemOptionValue === this.styleName && this.items.length !== 0)) {
              if (!this.itemOptions.includes('all')) this.itemOptions.push('all');
              if (this.itemOptionValue !== this.styleName && this.items.length === 4) {
                this.itemOptionValue = 'all';
              }
            }

            this.setItemsView();
          }
        },
      },
      items: {
        immediate: true,
        deep: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal) {
          // if (newVal.length) {
          //   //
          // } else {
          //   this.itemOptions = ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
          // }
        },
      },
      itemOptionValue: {
        immediate: true,
        handler(newVal) {
          this.setItemsView();

          if (newVal === 'all') {
            this.items = [];
            this.itemTypes.forEach(itemKey => {
              let item_val = this.$lget(this.elementData, `styles.${itemKey}`);
              if (item_val) {
                this.items.push({itemKey: itemKey, value: item_val});
                this.itemOptions = this.itemOptions.filter(item => item !== itemKey);
              }
            });
          }
        },
      },
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      saveItem(item, index, value) {
        if (this.itemOptionValue === this.styleName) {
          if (this.items.length === 1 && index === 0) {
            let changes = this.itemTypes.map(itemKey => {
              return {path: `styles.${itemKey}`, value: item.value};
            });
            this.debounce(changes);
          } else if (this.items.length === 2 && index === 0) {
            let changes = [`${this.styleName}-top`, `${this.styleName}-bottom`].map(itemKey => {
              return {path: `styles.${itemKey}`, value: item.value};
            });
            this.debounce(changes);
          } else if (this.items.length === 2 && index === 1) {
            let changes = [`${this.styleName}-right`, `${this.styleName}-left`].map(itemKey => {
              return {path: `styles.${itemKey}`, value: item.value};
            });
            this.debounce(changes);
          } else if (this.items.length === 3) {
            if (index === 1) {
              let changes = [`${this.styleName}-right`, `${this.styleName}-left`].map(itemKey => {
                return {path: `styles.${itemKey}`, value: item.value};
              });
              this.debounce(changes);
            } else {
              let itemKey = index === 0 ? `${this.styleName}-top` : `${this.styleName}-bottom`;
              this.debounce({path: `styles.${itemKey}`, value: item.value});
            }
          } else {
            if (index === 0) {
              this.debounce({path: `styles.${this.styleName}-top`, value: item.value});
            } else if (index === 1) {
              this.debounce({path: `styles.${this.styleName}-right`, value: item.value});
            } else if (index === 2) {
              this.debounce({path: `styles.${this.styleName}-bottom`, value: item.value});
            } else {
              this.debounce({path: `styles.${this.styleName}-left`, value: item.value});
            }
          }
        } else {
          this.debounce({path: `styles.${item.itemKey}`, value: item.value});
        }
      },
      setItemsView() {
        if (this.itemOptionValue === this.styleName) {
          if (!this.itemOptions.includes('all') && this.items.length) {
            this.itemOptions = [this.styleName, 'all'];
          }

          if (this.items.length === 4) {
            let item_maps = {};
            this.items.forEach(item => {
              let item_list = this.$lget(item_maps, item.value, []);
              item_list.push(item.itemKey);
              this.$lset(item_maps, item.value, item_list);
            });
            // console.log('item_maps', item_maps);
            const all = Object.keys(item_maps).find(key => this.itemTypes.every(i => item_maps[key].includes(i)));
            const top_bottom = Object.keys(item_maps).find(key => [`${this.styleName}-top`, `${this.styleName}-bottom`].every(i => item_maps[key].includes(i)));
            const right_left = Object.keys(item_maps).find(key => [`${this.styleName}-right`, `${this.styleName}-left`].every(i => item_maps[key].includes(i)));
            if (all) {
              this.items = [{value: all}];
            } else if (top_bottom && right_left) {
              this.items = [{value: top_bottom}, {value: right_left}];
            } else if (top_bottom === undefined && right_left) {
              const top = Object.keys(item_maps).find(key => item_maps[key].includes(`${this.styleName}-top`));
              const bottom = Object.keys(item_maps).find(key => item_maps[key].includes(`${this.styleName}-bottom`));
              this.items = [{value: top}, {value: right_left}, {value: bottom}];
            }
          } else if (this.items.length > 0 && this.items.length < 4) {
            const items_not_in = this.itemTypes.filter(itemKey => {
              return !this.items.map(i => i.itemKey).includes(itemKey);
            }, this);

            items_not_in.forEach(itemKey => {
              if (itemKey === `${this.styleName}-left` && !items_not_in.includes(`${this.styleName}-right`)) {
                let item = this.items.find(item => item.itemKey === `${this.styleName}-right`);
                this.debounce({path: `styles.${itemKey}`, value: item.value});
              } else if (itemKey === `${this.styleName}-bottom` && !items_not_in.includes(`${this.styleName}-top`)) {
                let item = this.items.find(item => item.itemKey === `${this.styleName}-top`);
                this.debounce({path: `styles.${itemKey}`, value: item.value});
              } else {
                this.debounce({path: `styles.${itemKey}`, value: '0px'});
              }
            }, this);
          }
        }
      },
      addItem() {
        if (this.items.length < 4) {
          if (this.itemOptionValue !== this.styleName) {
            this.itemOptions = this.itemOptions.filter(item => item !== this.itemOptionValue);
            this.items.push({itemKey: this.itemOptionValue, value: '0px'});
            // if (this.itemOptions.length === 1) {
            //   this.itemOptions.push('all');
            // }
            if (this.itemOptions.length > 1) {
              this.itemOptionValue = this.itemOptions[1];
            }
          } else {
            if (this.items.length === 2) {
              this.items.push({value: this.items[0].value});
            } else if (this.items.length === 3) {
              this.items.push({value: this.items[1].value});
            } else {
              this.items.push({value: '0px'});
            }
          }
        }
      },
      // eslint-disable-next-line no-unused-vars
      removeItem(item, index) {
        if (this.itemOptionValue !== this.styleName) {
          if (this.items.length !== 4) {
            this.itemOptions = this.itemOptions.filter(item => item !== 'all');
          }

          this.items = this.items.filter(i => i.itemKey !== item.itemKey);
          this.itemOptions.push(item.itemKey);
          this.itemOptionValue = item.itemKey;
          this.debounce({path: `styles.${item.itemKey}`, value: '$unset'});
        } else {
          this.items.pop();
          // console.log('removeItem', index, item);
          if (this.items.length === 3) {
            this.debounce({path: `styles.${this.styleName}-left`, value: this.items[1].value});
          } else if (this.items.length === 2) {
            this.debounce({path: `styles.${this.styleName}-bottom`, value: this.items[0].value});
          } else if (this.items.length === 1) {
            let changes = [`${this.styleName}-right`, `${this.styleName}-left`].map(itemKey => {
              return {path: `styles.${itemKey}`, value: this.items[0].value};
            }, this);
            this.debounce(changes);
          } else if (this.items.length === 0) {
            this.itemOptions = this.itemOptions.filter(item => item !== 'all');
            let changes = this.itemTypes.map(itemKey => {
              this.itemOptions.push(itemKey);
              return {path: `styles.${itemKey}`, value: '$unset'};
            }, this);
            this.debounce(changes);
            this.itemOptionValue = this.itemOptions[0];
          }
        }
      },
      itemTitle(index) {
        if (this.items.length === 1 && index === 0) {
          return 'All';
        } else if (this.items.length === 2 && index === 0) {
          return 'Top Bottom';
        } else if (this.items.length === 2 && index === 1) {
          return 'Right Left';
        } else if (this.items.length === 3 && index === 1) {
          return 'Right Left';
        } else if ((this.items.length === 3 && index === 0) || index === 0) {
          return 'Top';
        } else if (index === 1) {
          return 'Right';
        } else if ((this.items.length === 3 && index === 2) || index === 2) {
          return 'Bottom';
        } else if (index === 3) {
          return 'Left';
        } else {
          return '';
        }
      },
      debounce(val) {
        if (!Array.isArray(val)) {
          val = [val];
        }
        let changes = val.reduce((acc, curr) => {
          let ele_val = this.$lget(this.element, curr.path);
          if (ele_val !== curr.value) {
            if (curr.value === '$unset') {
              this.$lunset(this.elementData, curr.path);
            } else {
              this.elementData = Object.assign({}, this.$lset(this.elementData, curr.path, curr.value));
            }
            acc.push(curr);
          }
          return acc;
        }, []);

        if (changes.length) {
          this.$emit('stylesUpdate', changes);
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_MarginPaddingSelector.scss">

</style>
