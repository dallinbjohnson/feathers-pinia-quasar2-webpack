<template>
  <div v-if="item.children">
    <q-item clickable v-ripple exact :class="itemClass" :active-class="itemActiveClass">
      <q-item-section avatar>
        <q-icon v-if="item.icon" :name="item.icon"></q-icon>
        <q-tooltip anchor="top right" self="center middle">
          {{ item.title }}
        </q-tooltip>
      </q-item-section>
      <q-item-section @click="expanded = !expanded">
        <q-item-label>{{ item.title }}</q-item-label>
        <q-item-label v-if="item.caption" caption>{{ item.caption }}</q-item-label>
      </q-item-section>
      <q-item-section side :top="true">
        <q-btn size="sm"
               round
               unelevated
               :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
               @click="expanded = !expanded"/>
      </q-item-section>
    </q-item>
    <div v-if="expanded">
      <menu-list-item-ex v-for="childItem in item.children"
                         v-bind:key="childItem.id"
                         :item="childItem"
                         :icon-size="'xs'"
                         :active-class="itemActiveClass"/>
    </div>
  </div>
  <div v-else>
    <q-item clickable
            v-ripple
            v-bind:key="item.path"
            :to="item.to ? item.to : {name: item.name}"
            exact
            :class="itemClass"
            :active-class="itemActiveClass">
      <q-item-section avatar>
        <!-- Workaround for badge, if desired to show when menus is collapsed
        <div class="relative-position" style="width:25px;margin-left:2px">
          <q-icon :name="item.icon" size="24px">
          </q-icon>
          <q-badge v-if="item.badge && !collapsed" :label="item.badge" floating/>
        </div>-->
        <q-icon v-if="item.icon" :name="item.icon"></q-icon>
        <q-tooltip anchor="top right" self="center middle">
          {{ item.title }}
        </q-tooltip>
      </q-item-section>
      <q-item-section style="margin-left: 10px;">
        <q-item-label>{{ item.title }}</q-item-label>
        <q-item-label v-if="item.caption" caption>{{ item.caption }}</q-item-label>
      </q-item-section>

      <q-item-section v-if="hasSide" side :top="isSideTop">
        <q-badge v-if="item.badge" :color="item.badgeColor || 'primary'" :label="item.badge"/>
        <q-item-label v-if="item.sideCaption" caption>{{ item.sideCaption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
  export default {
    name: 'MenuListItemEx',
    props: {
      item: {
        type: Object,
        default: null,
      },
      collapsed: {
        type: Boolean,
        default: true,
      },
      activeClass: {
        type: String,
        default: '',
      },
      insetLevel: {
        type: Number,
        default: 0,
      },
      iconSize: {
        type: String,
        default: 'sm',
      },
    },
    data: function () {
      return {
        expanded: false,
      };
    },
    computed: {
      itemClass: function () {
        return this.item.class ? this.item.class : '';
      },
      itemActiveClass: function () {
        return this.item.activeClass ? this.item.activeClass : this.activeClass;
      },
      hasSide: function () {
        return 'badge' in this.item || 'sideCaption' in this.item;
      },
      isSideTop: function () {
        return 'caption' in this.item || 'sideCaption' in this.item;
      },
    },
    watch: {},
    methods: {
      onClick(evt) {
        this.$emit('expansionItemClick', evt);
      },
      onShow(evt) {
        this.$emit('itemExpanded', evt);
      },
      onHide(evt) {
        this.$emit('itemCollapsed', evt);
      },
    },
  };
</script>
