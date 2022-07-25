<template>
  <div class="bg-transparent full-width q-pa-sm">
    <q-table title="Products Prices" flat :data="productPriceList" table-class="full-width self-center ">
      <template #body-cell="props">
        <td v-if="props.col.name === 'product'">
          {{ $lget(products.find(product => product._id === $lget(props.row, 'product')), 'title') }}

        </td>
        <td v-else-if="props.col.name === 'actions'">
          <div class="row q-gutter-sm">
            <q-btn flat color="primary" dense icon="edit" @click="edit(props.row)"/>
            <q-btn flat color="negative" dense icon="delete" @click="remove(props.row)"/>
          </div>
        </td>
        <td v-else>
          {{ props.row[props.col.name] }}
        </td>

      </template>
      <template #no-data>
        No price listed!
      </template>
      <template #top-right>
        <q-btn v-if="options.length > 0" icon="add" label="Product Price" @click="openDialog" outline color="primary"/>
      </template>
    </q-table>
    <q-dialog v-model="open" position="right">
      <q-card style="max-width: 300px;">
        <q-card-section>
          <form-generator v-model="productPrice" :fields="fields" v-model:valid="valid"/>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Save" color="primary" @click="save"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="openRemove" persistent position="right">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white"/>
          <div class="q-ml-sm">
            You are about to delete the product list for the
            {{ $lget(products.find(product => product._id === $lget(productPriceToRemove, 'product')), 'title') }}
            product
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="cancelRemove"/>
          <q-btn label="Go Ahead" color="primary" v-close-popup @click="confirmRemove"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'price-list-select',
    props: {
      value: {
        type: Array,
        default() {
          return [
            /*{
              product : {
                _id: 'fdgghegut',
                title: 'Dog'
              },
              price: 4000
            }*/
          ];
        },
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'products',
        name: 'products',
        qid: 'products',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
    ],
    data() {
      return {
        productPrice: {
          product: undefined,
          price: undefined,
        },
        valid: false,
        open: false,
        productPriceList: [],
        openRemove: false,
        productPriceToRemove: undefined,
        options: [],
      };
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler(newVal) {

          this.productPriceList = newVal.map(productPrice => {
            const {product, price} = productPrice;
            return {product, price, actions: product};
          });
          const listedProducts = newVal.map(productPrice => productPrice.product);
          this.options = this.products.filter(product => !listedProducts.includes(product._id));
        },
      },
      products: {
        immediate: false,
        deep: true,
        handler(newVal) {
          this.options = newVal;
        },
      },
    },
    computed: {

      fields() {
        return [
          {
            fieldType: 'SelectInput',
            path: 'product',
            attrs: {
              label: 'Product',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'title',
              'bottom-slots': true,
              options: this.options,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'TextInput',
            path: 'price',
            attrs: {
              label: 'Price',
              type: 'number',
              prefix: '$',
              mask: '###,###,###.##',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      openDialog() {
        this.open = true;
        this.productPrice = {
          product: undefined,
          price: undefined,
        };
      },
      save() {
        const {product, price} = this.productPrice;
        const index = this.productPriceList.findIndex(object => object.product === product);
        if (index === -1) {
          this.productPriceList.push({product, price, actions: product});
        } else {
          this.productPriceList.map(obj => {
            if (obj.product === product) {
              obj.price = price;
            }
          });
        }
        this.productPrice = {
          product: undefined,
          price: undefined,
        };
        this.$emit('input', this.productPriceList);
      },
      edit(value) {
        this.options = this.products;
        this.productPrice = Object.assign({}, value);
        this.open = true;
      },
      remove(value) {
        this.productPriceToRemove = Object.assign({}, value);
        this.openRemove = true;
      },
      cancelRemove() {
        this.productPriceToRemove = undefined;
        this.openRemove = false;
      },
      confirmRemove() {
        this.productPriceList = this.productPriceList.filter(item => item['product'] !== this.productPriceToRemove['product']);
        this.productPriceToRemove = undefined;
        this.openRemove = false;
      },
    },
  };
</script>

<style scoped>

</style>
