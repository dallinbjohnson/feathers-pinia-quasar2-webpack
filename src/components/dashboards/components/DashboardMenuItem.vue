<template>
  <div>
    <q-expansion-item
      class="q-px-xs"
      clickable
      :content-inset-level=".2"
      v-if="$props.hasOwnProperty('children')"
      :icon="icon"
      :label="title"
      :caption="caption"
      :key="title"
    >
      <q-item
        v-for="childLink in $props['children']"
        clickable
        :tag="tag"
        :key="childLink.title"
        @click="$emit('active',childLink.path)"
      >
        <q-item-section v-if="icon" avatar>
          <q-icon :name="icon"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption>
            {{ caption }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-item clickable
            v-else
            :tag="tag"
            @click="$emit('active',path)"
            v-bind="$props"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon"/>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>
          {{ caption }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
  export default {
    name: 'dashboard-menu-item',
    props: {
      title: {
        type: String,
      },
      path: {
        type: String,
      },
      caption: {
        type: String,
        default: '',
      },
      tag: {
        type: String,
        default: 'a',
      },
      icon: {
        type: String,
        default: '',
      },
    },
  };
</script>
