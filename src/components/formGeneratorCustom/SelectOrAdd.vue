<template>
  <div style="width: 100%;">
    <select-input :path="path" v-bind="$attrs" :slots="inbuiltSlots" >
      <template #before-options>
        <q-linear-progress v-if="loading"  query :color="$q.dark.mode?'accent':'primary'" class="q-mt-none" reverse/>
        <q-space v-else/>
      </template>
      <template #option="scope">
        <slot name="option" v-bind="scope">
          <q-item class="q-my-sm" clickable v-ripple v-bind="scope.itemProps" v-on="scope.itemEvents">
            <q-item-section avatar v-if="$lget(scope,['opt',$lget(serviceToAddOptionsMapping,'avatar','avatar')])">
              <q-avatar color="primary" text-color="white">
                <q-img :src="$lget(scope,['opt',$lget(serviceToAddOptionsMapping,'avatar','avatar')])"/>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{
                  $lget(scope, ['opt', $lget(serviceToAddOptionsMapping, 'label', 'label')])
                }}
              </q-item-label>
              <q-item-label caption lines="1">
                {{ $lget(scope, ['opt', $lget(serviceToAddOptionsMapping, 'description', 'description')]) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-btn color="primary" dense icon="edit" flat @click.stop="edit($lget(scope,'opt'))"/>
              <q-btn color="primary" dense icon="fas fa-trash" flat @click.stop="remove($lget(scope,'opt'))"/>
            </q-item-section>
          </q-item>
        </slot>
      </template>
      <template #after-options>
        <div class="row q-pa-md justify-between">
          <q-btn color="primary" icon="add" label="New" @click="openAddForm = true"/>
          <div v-if="showPaginationControls" class="row items-center q-gutter-sm">
            <span class="text-caption">Rows per page: </span>
            <q-select input-class="text-caption" dense outlined :value="pagination.rowsPerPage"
                      @input="changeRowsPerPage($event)" :options="pagination.rowsPerPageOptions"/>
            <q-btn v-if="showPaginationControls" dense flat color="primary" icon="fas fa-chevron-left" @click="decrementPage"/>
            <q-btn v-if="showPaginationControls" dense flat color=primary icon="fas fa-chevron-right" @click="incrementPage"/>
          </div>
        </div>
      </template>
     <template #no-option>
       <div class="row q-pa-md justify-between items-center">
         <q-btn color="primary" icon="add" label="New" @click="openAddForm = true"/>

         <span class="text-caption text-primary">
             No {{ path }} results
         </span>

       </div>
     </template>

      <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
    </select-input>

    <q-dialog v-model="openAddForm" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Add new {{ path }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <form-generator
            v-model="formData"
            :fields="serviceToAddFields"
            useQform
            v-model:valid="valid"
            class="flex justify-center"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" :color="$q.dark.mode ? 'orange' : 'primary'" @click="clear"/>
          <q-btn label="Save" color="primary" :loading="sending" @click="send" :disable="!valid|| sending"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import SelectInput
    from '@iy4u/form-gen-client-lib/src/components/common/atoms/SelectInput/SelectInput.vue';
  import isEmpty from '@iy4u/common-client-lib/src/utils/isEmpty.js';

  export default {
    name: 'SelectOrAdd',
    components: {
      SelectInput,
    },
    props: {
      path: {
        type: String,
      },
      modelName: {
        type: String,
        required: true,
      },
      serviceToAdd: {
        type: String,
      },
      serviceToAddFields: {
        type: Array,
        default() {
          return [];
        },
      },
      serviceToAddIcon: {
        type: String,
      },
      serviceToAddOptionsMapping: {
        type: Object,
      },
    },
    data() {
      return {
        loading: false,
        openAddForm: false,
        formData: undefined,
        sending: false,
        valid: false,
        inbuiltSlots: ['before-options','after-options','no-option'],
        toEdit: false,
        pagination: {
          rowsPerPage: 5,
          page: 1,
          sortBy: '',
          descending: false,
          rowsPerPageOptions: [5, 10, 20, 35],
        },
        fetching: false
      };
    },

    computed: {
      showPaginationControls() {
        const optionsLength = this.$lget(this.$attrs, ['attrs', 'options'], []).length;
        return  optionsLength && this.pagination.rowsPerPage <= optionsLength;
      },
    },
    watch: {

      serviceToAddOptionsMapping: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (isEmpty(newVal)) {
            this.inbuiltSlots.push('option');
          }
        },
      },
    },
    methods: {
      async send() {
        try {
          this.sending = true;
          const FormData = this.$FeathersVuex.api[this.modelName];
          const data = new FormData(this.formData).clone();
          await data.save({
            data: this.formData,
          });
          this.$q.notify({
            message: `${this.path} ${this.toEdit ? 'edited' : 'added'}`,
            color: 'green-4',
            textColor: 'white',
            icon: this.serviceToAddIcon,
          });
          this.clear();
        } catch (e) {
          this.$q.notify({
            message: e.message,
            color: 'negative',
            textColor: 'white',
            icon: 'warning',
          });
          this.sending = false;
        }
      },
      edit(data) {
        this.formData = data;
        this.openAddForm = true;
        this.toEdit = true;
      },
      remove(data) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Would you like to delete this ${this.path}?`,
          ok: {
            push: true,
            color: 'primary',
          },
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          // console.log('>>>> OK')
          try {
            await data.remove();
            this.$q.notify({
              message: ` The ${this.path} was successfully removed.`,
              color: 'green-4',
              textColor: 'white',
              icon: this.serviceToAddIcon,
            });
          } catch (e) {
            this.$q.notify({
              message: e.message,
              color: 'negative',
              textColor: 'white',
              icon: 'warning',
            });
          }
        }).onOk(async () => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          this.clear();
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      },
      incrementPage() {
        this.pagination.page += 1;
        this.$emit('pagination-changed', {service: this.serviceToAdd, pagination: this.pagination});
      },
      decrementPage() {
        this.pagination.page -= 1;
        this.$emit('pagination-changed', {service: this.serviceToAdd, pagination: this.pagination});
      },
      changeRowsPerPage(newVal) {
        this.pagination.rowsPerPage = newVal;
        this.$emit('pagination-changed', {service: this.serviceToAdd, pagination: this.pagination});
      },
      clear() {
        this.sending = false;
        this.toEdit = false;
        this.openAddForm = false;
        this.formData = undefined;
      },
    },
  };
</script>

<style scoped>
  .input-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
