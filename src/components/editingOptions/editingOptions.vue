<template>
  <div id="editingOptions" class="flex flex-center" style="flex-wrap: nowrap; width: auto; cursor: default;">
    <div id="type" contenteditable="false">
      {{ type }}
    </div>
    <q-icon v-if="parent && options.parent"
            class="cursor-pointer"
            size="sm"
            color="white"
            name="keyboard_arrow_up"
            @click.stop="setParent">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        Jump to Parent
      </q-tooltip>
    </q-icon>
    <q-icon v-if="parent && options.parent"
            class="cursor-pointer"
            size="14px"
            color="white"
            name="fas fa-copy"
            @click.stop="duplicate">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
        Duplicate
      </q-tooltip>
    </q-icon>
    <q-icon v-if="options.delete"
            color="white"
            name="delete"
            size="xs"
            class="cursor-pointer"
            @click.stop="startRemove(currentElement)">
      <q-tooltip>Delete</q-tooltip>
    </q-icon>

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section>
          <h4>Are you sure you want to remove {{ handleMessage }}?</h4>
          <q-card-actions style="width: 100%; display: flex; justify-content: flex-end">
            <q-btn flat @click.stop="deleteDialog = false">Cancel</q-btn>
            <q-btn color="red" @click.stop="removeFromTree">Delete</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapFields} from 'vuex-map-fields';

  export default {
    name: 'editingOptions',
    props: {
      parent: Object,
      type: String,
      options: {
        type: Object,
        default() {
          return {
            delete: true,
            parent: true,
          };
        },
      },
    },
    data() {
      return {
        deleteItem: {},
        deleteDialog: false
      };
    },
    created() {
    },
    mounted() {
    },
    computed: {
      feathersAxios() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
      jumpToParent() {
        return {...this.parent, parentJump: true};
      },
      ...mapFields(['currentElement']),
      handleMessage() {
        if (this.deleteItem._type) {
          return 'element';
        } else {
          return 'this section and everything in it';
        }
      }
    },
    methods: {
      setParent() {
        // console.log('emiting the parent', this.parent);
        this.$emit('jumpToParent', this.jumpToParent);
      },
      duplicate() {
        let payload;
        let elementCopy = this.$lcloneDeep(this.currentElement);

        const a = this.$lget(this.parent, 'sections', []).length;
        const b = this.$lget(this.parent, 'children', []).length;
        const c = this.$lget(this.parent, 'elements', []).length;
        const newOrder = a + b + c;

        let type = elementCopy._type;

        if (type) {
          payload = {
            action: 'duplicateTemplate',
            templateAction: 'elementTemplate',
            value: elementCopy._id,
            section_id: this.parent._id,
            order_position: newOrder,
          };
        } else {
          let page_id = this.parent.page ? this.parent.page : this.parent._id;
          // console.log('check page_id', page_id);
          let parent_id = page_id === this.parent._id ? undefined : this.parent._id;
          // console.log('check parent_id', parent_id);
          // elementCopy.styles.order = newOrder;
          // // console.log('1 order setter', elementCopy.styles.order);

          payload = {
            action: 'duplicateTemplate',
            templateAction: 'sectionTemplate',
            value: elementCopy._id,
            order_position: newOrder,
            parent_id,
            page_id,
          };
        }
        console.log('duplicate payload:', payload);
        this.feathersAxios.post('/wpb-management', payload)
          .then(res => {
            console.log('Duplication success!', res);
          })
          .catch(err => {
            console.error('Duplication error', err);
          });
      },
      startRemove(val) {
        this.deleteItem = val;
        this.deleteDialog = !this.deleteDialog;
      },
      async removeFromTree() {
        let element = this.$lget(this.deleteItem, '_type');
        this.$q.loading.show( {message: 'Removing', ignoreDefaults: true});
        if (element) {
          await this.$store.dispatch('wpb-elements/remove', this.deleteItem._id)
            .catch(err => {
              console.error('problem removing element\n', err);
            });
        } else {
          await this.$store.dispatch('wpb-sections/remove', this.deleteItem._id)
            .catch(err => {
              console.error('problem removing section\n', err);
            });
        }
        this.deleteDialog = false;
        this.deleteItem = {};
        this.$isLoading(false);
      }
    },
  };
</script>

<style scoped lang="scss">
  #editingOptions {
    height: 25px;
    position: absolute;
    top: -25px;
    right: 10px;
    font-size: 10pt;
    line-height: 1;
    background-color: #4D8EFF;
  }

  #type {
    color: white;
    text-decoration: none;
    font-weight: normal;
    font-family: Helvetica;
    letter-spacing: normal;
    padding: 0 5px;
  }
</style>
