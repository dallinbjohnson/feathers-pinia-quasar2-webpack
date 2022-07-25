<template>
  <dashboard-layout :dashboard-side-menu-links="messageLinks"
                    @clicked-link="onSelectLink">
    <template #side-menu-top>
      <q-btn class="q-mb-md q-mt-xs fill-width"
             rounded
             size="md"
             icon="fas fa-pencil-alt"
             :outline="$q.dark.mode"
             label="Compose"
             @click="showInbox = true"/>
    </template>
    <template #page-toolbar>
      <div>
        <div>
          <q-input outlined
                   v-model="filter.words"
                   dense
                   :placeholder="searchPlaceholder"
                   @focus="onFilterInput">
            <template #prepend>
              <q-btn style="margin-left:-0.5rem;"
                     round
                     flat
                     dense
                     size="md"
                     icon="search"/>
            </template>
          </q-input>
        </div>
        <q-slide-transition>
          <div v-if="showFilters" class=" gt-xs row justify-between no-wrap">
            <div class="row q-gutter-sm q-my-sm no-wrap filter-scroll-area">
              <q-chip dark
                      @click="toggleSelected(filter)"
                      :selected="selectedFilters.some(f => f.label === filter.label)"
                      rounded
                      size="sm"
                      v-for="filter in filterOptions"
                      :key="filter.label"
                      :color="filter.color"
                      :icon="filter.icon">

              </q-chip>
            </div>
            <div class="row q-gutter-sm items-center no-wrap" style="float:right;">
              <q-btn flat
                     icon="filter"
                     label="add filter"
                     aria-label="Add Filter"
                     @click="showAddFilters = true"/>
              <q-btn flat
                     dense
                     icon="close"
                     aria-label="Close Filters"
                     @click="closeFilters"/>
            </div>
          </div>
        </q-slide-transition>
      </div>
    </template>

    <template #close-drawer-btn>
      <transition v-if="showFilters && !$q.screen.xs"
                  appear
                  enter-active-class="animated fadeOut"
                  leave-active-class="animated fadeIn">
        <span/>
      </transition>
    </template>

    <template #page-content>
      <q-slide-transition>
        <q-card flat
                square
                v-if="showAddFilters"
                class="q-pa-md"
                style="margin-top: -2rem; margin-right:-1rem; margin-left: -0.4rem;">

          <div class="row q-gutter-sm items-center">
            <accounts-filter label="From:"
                             hint="Search senders by name or email"
                             v-model="filter.from"/>
          </div>
          <div class="row q-gutter-sm items-center justify-end">
            <accounts-filter label="To:"
                             hint="Search recipients by name or email"
                             v-model="filter.to"/>

          </div>
          <div class="row q-gutter-sm items-center justify-end">
            <q-input hint="Search by subject" label="Subject:" v-model="query.subject.$regex" style="flex: 1;" dense/>
          </div>
          <div class="row q-gutter-sm items-center justify-end">
            <q-input hint="Body includes" label="Has Words:" v-model="query.body.$regex" style="flex: 1;" dense/>
          </div>
          <div class="row q-gutter-sm items-center justify-end">
            <q-input hint="Body does not include" label="Has Words:" v-model="filter.nowords" style="flex: 1;" dense/>
          </div>
          <div class="row q-gutter-sm items-center justify-between">
            <date-piker label="From Date" v-model="filter.fromDate" dense style="width: 100%"/>
            <date-piker label="To Date" v-model="filter.toDate" dense style="width: 100%"/>
          </div>
          <div class="row q-gutter-sm items-center justify-between q-py-md">
            <q-checkbox class="text-caption"
                        style="margin-left:-0.1rem;"
                        v-model="filter.hasAttachment"
                        :true-value="true"
                        label="Has attachment(s)"/>
            <div :class="`row q-gutter-md ${$q.screen.xs ? 'justify-between': 'justify-end'}`">
              <q-btn class="gt-xs" flat label="Save filter" no-caps @click="saveFilter"/>
              <q-btn color="primary" label="Search" no-caps @click="filterMessages"/>
            </div>
          </div>
        </q-card>

      </q-slide-transition>
      <div class="content-area" :style="showAddFilters?'z-index:-1':'z-index:0'">
        <!--       <pre> {{ linkQuery }}</pre>-->
        <table-template flat
                        square
                        v-bind="$attrs"
                        row-key="_id"
                        :data="messages"
                        :selection="messages.length > 0 ? 'multiple':'single'"
                        v-model:selected="selected"
                        :visible-columns="visibleColumns"
                        :rows-per-page-label="`messages per page`"
                        v-model:pagination="pagination"
                        @request="setPagination"
                        :grid="($q.screen.sm || $q.screen.xs)"
                        table-class="cursor-pointer"
                        @row-click="onOpenMessage"
                        :open-add-form="openMessage"
                        :loading="isFindMessagesPending">
          <template #top>

          </template>
          <template #no-data>
            No messages {{ link }}
          </template>

          <template #header-cell="props">

            <q-th v-if="props.col.name==='__v'" :props="props">
              Actions
            </q-th>
            <q-th v-else :props="props">
              {{
                capitalize(kebabize(props.col.name).replace('-', ' '))
              }}
            </q-th>

          </template>

          <template #body-cell="props">
            <q-td v-if="props.col.name==='__v'">
              <div class="row justify-end q-gutter-sm">

                <q-btn icon-right="delete"
                       no-caps
                       flat
                       dense
                       @click.stop="openDeleteConfirm(props.row)"/>
              </div>
            </q-td>
            <q-td v-else-if="props.col.name==='from'" :props="props">
              <div class="flex items-center">
                <!--                <q-avatar v-if="$lget(props,['row','_fastjoin',props.col.name,'avatar','raw','file'])">-->
                <!--                  <q-img :src="$lget(props,['row','_fastjoin',props.col.name,'avatar','raw','file'])"/>-->
                <!--                </q-avatar>-->
                <div class="q-mr-xl">
                  <random-avatar size="lg"
                                 :user="$lget(props,['row','_fastjoin',props.col.name])"
                                 :menu="false"/>
                  <p> {{ $lget(props, ['row', '_fastjoin', props.col.name, 'name']) }} </p>
                </div>
                <q-badge v-if="$lget($activeAccount, 'unseenMessages', []).includes($lget(props, ['row', '_id']))"
                         id="newBadge"
                         class="q-ml-sm"
                         align="middle">new!
                </q-badge>
              </div>
            </q-td>
            <q-td v-else-if="props.col.name==='to'" :props="props">
              <div v-if="Array.isArray($lget(props, ['row', '_fastjoin', props.col.name]))">
                <vue-group-avatar
                  :avatars="$lget(props,['row','_fastjoin',props.col.name],[]).map(acc=>$lget(acc,['avatar','raw','file']))"
                  :max="2"/>
                <!--{{$lget(props, ['row', '_fastjoin', props.col.name]).map(acc=>$lget(acc,['avatar','raw','file']))}}-->
              </div>

              <div v-else>
                <!--                <q-avatar v-if="$lget(props,['row','_fastjoin',props.col.name,'avatar','raw','file'])">
                                  <q-img :src="$lget(props,['row','_fastjoin',props.col.name,'avatar','raw','file'])"/>
                                </q-avatar>-->
                <random-avatar size="lg"
                               :user="$lget(props,['row','_fastjoin',props.col.name])"
                               :menu="false"/>
                <p> {{ $lget(props, ['row', '_fastjoin', props.col.name, 'name']) }} </p>
              </div>
            </q-td>
            <q-td v-else-if="props.col.name==='body'" :props="props">
              <div style="max-width:16rem;" v-html="$lget(props, ['row', 'body'])" class="ellipsis text-caption"/>
            </q-td>
            <q-td v-else :props="props">
              {{
                $lget(props, ['row', props.col.name])
              }}
            </q-td>

          </template>

          <template v-if="($q.screen.sm || $q.screen.xs)" #item="props">
            <q-item clickable v-ripple style="min-width:100%" @click="onOpenMessage($event,props.row)">
              <q-item-section top avatar>
                <div v-if="$lget(props.row,'from')">
                  <random-avatar size="lg"
                                 :user="$lget(props.row,['_fastjoin','from'])"
                                 :menu="false"/>
                </div>
                <div v-if="$lget(props.row,'to',[]).length>0">
                  <div v-if="$lget(props, ['row', '_fastjoin', 'to'],[]).length">
                    <vue-group-avatar
                      :avatars="$lget(props,['row','_fastjoin','to'],[]).map(acc=>$lget(acc,['avatar','raw','file']))"
                      :max="2"/>
                  </div>

                  <div v-else>
                    <!--                    <q-avatar v-if="$lget(props,['row','_fastjoin','to','avatar','raw','file'])">
                                          <q-img :src="$lget(props,['row','_fastjoin','to','avatar','raw','file'])"/>
                                        </q-avatar>-->
                    <random-avatar size="lg"
                                   :user="$lget(props.row,['_fastjoin','to'])"
                                   :menu="false"/>
                    <!--                      <p> {{ $lget(props, ['row', '_fastjoin', 'to', 'name']) }} </p>-->
                  </div>

                </div>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ $lget(props.row, 'subject') }}</q-item-label>
                <q-item-label caption lines="2">
                  <div v-html="$lget(props.row, 'body')" class="ellipsis text-caption"/>
                </q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-btn icon-right="delete"
                       no-caps
                       flat
                       dense
                       @click.stop="openDeleteConfirm(props.row)"/>
              </q-item-section>
            </q-item>
            <q-separator style="width: 100%"/>
          </template>
          <template #form >
            <div class="q-py-md">
              <div class="row q-gutter-sm">

                <q-btn flat
                       :size="($q.screen.sm || $q.screen.xs)? 'sm': '' "
                       icon="fas fa-arrow-left"
                       @click="openMessage=false"/>
                <div :class="($q.screen.sm || $q.screen.xs)?'text-h6':'text-h4'">
                  <q-item-label v-if="!openedMessage">
                    <q-skeleton flat  icon="fas fa-arrow-left"   type="text" style="width: 100px;"/>
                  </q-item-label>
                  <q-item-label v-else>{{ $lget(openedMessage, 'subject') }}</q-item-label>
                </div>
              </div>
              <q-item>
                <q-item-section top avatar>
                  <q-skeleton flat  icon="fas fa-arrow-left" v-if="!openedMessage"  type="QAvatar"/>
                  <random-avatar v-else size="lg"
                                 :user="$lget(openedMessage ,['_fastjoin','from'])"
                                 :menu="false"/>
                </q-item-section>

                <q-item-section>
                  <q-item-label  v-if="!openedMessage">
                    <q-skeleton type="text" style="max-width: 100px;" />
                  </q-item-label>
                  <q-item-label v-else>{{ $lget(openedMessage, ['_fastjoin', 'from', 'name']) }}</q-item-label>
                  <q-item-label caption  v-if="!openedMessage">
                    <q-skeleton type="text" style="max-width: 100px;" />
                  </q-item-label>
                  <q-item-label v-else caption>{{ $lget(openedMessage, ['_fastjoin', 'from', 'email']) }}</q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-chip v-if="$lget(openedMessage,'attachments',[]).length"
                          icon="attachment"
                          :label="$lget(openedMessage,'attachments',[]).length"/>
                </q-item-section>
              </q-item>

              <div  v-if="!openedMessage" class="q-pa-md">
                <q-skeleton height="100px" square />
              </div>
              <div v-else class="q-pa-md" v-html="$lget(openedMessage, 'body')"/>
              <div class="q-px-md justify-start">
                <p class="q-mb-none text-bold">{{ $lget(openedMessage, ['_fastjoin', 'from', 'name']) }}</p>
                <p class="q-mb-none text-caption">
                  {{ $lget(openedMessage, ['_fastjoin', 'from', 'phones', '0', 'number', 'national']) }}</p>
                <p class="q-mb-none text-caption">{{ $lget(openedMessage, ['_fastjoin', 'from', 'email']) }}</p>
              </div>

            </div>
            <div class="q-px-md" v-if="$lget(openedMessage,'attachments',[]).length">
              <p>{{ $lget(openedMessage, 'attachments', []).length }}
                {{ $lget(openedMessage, 'attachments', []).length > 1 ? 'Attachments' : 'Attachment' }}</p>
              <div class="row q-gutter-md">
                <q-card style="min-width: 10%"
                        v-for="att in $lget(openedMessage,'attachments',[])"
                        :key="$lget(att,'_id')">
                  <q-img :src="$lget(att,'path',$lget(att,'href'))"
                         basic>
                    <div class="absolute-bottom text-subtitle2 text-center">
                      <q-btn :disabled="downloading" :loading="downloading" icon="download" @click="downloadItem(att)"/>
                    </div>
                  </q-img>
                </q-card>
              </div>
            </div>
            <template v-if="$lget(openedMessage,['_fastjoin','replies'],[]).length">

              <div class="q-px-md"
                   v-for="(reply, index) in $lget(openedMessage,['_fastjoin','replies'],[])"
                   :key="index">
                <q-separator spaced/>
                <q-item>
                  <q-item-section top avatar>
                    <random-avatar size="lg"
                                   :user="$lget(reply ,'from')"
                                   :menu="false"/>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ $lget(reply, ['from', 'name']) }}</q-item-label>
                    <q-item-label caption>{{ $lget(reply, ['from', 'email']) }}</q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-chip v-if="$lget(reply,'attachments',[]).length"
                            icon="attachment"
                            :label="$lget(reply,'attachments',[]).length"/>
                  </q-item-section>
                </q-item>
                <div class="q-py-md" v-html="$lget(reply, 'body')"/>
                <div v-if="$lget(reply,'attachments',[]).length">
                  <div class="row q-gutter-md">
                    <q-card style="min-width: 10%"
                            v-for="att in $lget(reply,'attachments',[])"
                            :key="$lget(att,'_id')">
                      <q-img :src="$lget(att,'path',$lget(att,'href'))"
                             basic>
                        <div class="absolute-bottom text-subtitle2 text-center">
                          <q-btn :disabled="downloading"
                                 :loading="downloading"
                                 icon="download"
                                 @click="downloadItem(att)"/>
                        </div>
                      </q-img>
                    </q-card>
                    <q-separator spaced/>
                  </div>
                </div>
              </div>
            </template>
            <div class="q-pa-md row justify-between">
              <div class=" q-gutter-xs">
                <q-btn size="sm"
                       icon="fas fa-reply"
                       no-caps
                       outline
                       rounded
                       color="primary"
                       label="Reply"
                       @click="replyMsg"/>
                <q-btn size="sm"
                       icon-right="fas fa-share"
                       no-caps
                       outline
                       rounded
                       color="primary"
                       label="Forward"
                       @click="forwardMsg"/>
              </div>
              <div>

                <q-btn flat size="sm" icon="delete" @click="openDeleteConfirm"/>
              </div>
            </div>

          </template>

          <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope"/>
          </template>
        </table-template>
      </div>
      <inbox-dialog v-model="showInbox" style="display: flex" :title="dialogTitle" @close="closeDialog">
        <inbox-form :message="msgToEdit" :is-reply="isReply" @sent="sent"/>
      </inbox-dialog>
    </template>
  </dashboard-layout>
</template>

<script>
  import {capitalize, kebabize, singularize} from '@iy4u/common-client-lib/src/utils';
  import DashboardLayout from 'components/dashboards/DashboardLayout';
  import AccountsFilter from 'pages/messages/components/accounts-filter';
  import DatePiker from 'pages/messages/components/date-piker';
  import InboxDialog from 'pages/messages/components/inbox-dialog';
  import InboxForm from 'pages/messages/components/inbox-form';
  import {makeFindPaginateMixin, routerMixin} from '@iy4u/common-client-lib';
  import TableTemplate from '@iy4u/common-client-lib/src/components/common/molecules/tables/TableTemplate.vue';
  import RandomAvatar from 'components/profile/RandomAvatar/RandomAvatar';
  import VueGroupAvatar from 'pages/messages/components/VueGroupAvatar/VueGroupAvatar';


  export default {
    name: 'Messages',
    components: {
      VueGroupAvatar,
      RandomAvatar,
      TableTemplate,
      InboxForm,
      InboxDialog,
      DatePiker,
      AccountsFilter,
      DashboardLayout,
    },
    mixins: [
      makeFindPaginateMixin({
        name: 'messages',
        service: 'in-app-messages',
        qid: 'messages',
        skip: 0,
        limit: 8,
        query() {
          // console.log('twaha: ',query);
          return Object.assign(
            {},
            {
              $sort: {
                updatedAt: -1,
                status: 'new',
              },
            },
            this.linkQuery,
            this.selectedFilterQuery,
            this.searchBoxQuery,
          );
        },
        params() {
          return this.params;
        },
      }),
      routerMixin({
        name: 'msgPaths',
        parseQuery(val, key) {
          if (['openMessage'].includes(key)) {
            return JSON.parse(val);
          } else {
            return val;
          }

        },
        query() {
          return {
            link: this.link,
            linkQuery: this.linkQuery,
            openMessage: this.openMessage,
            openedMessageId: this.openedMessageId,
          };
        },
      }),
    ],
    data() {
      const DAY_MS = 7 * 24 * 60 * 60 * 1000;
      return {
        visibleColumns: [],
        linkQuery: {},
        columns: [],
        selected: [],
        pagination: {
          sortBy: 'desc',
          descending: false,
          page: 1,
        },
        filterOptions: [
          {
            icon: 'fas fa-book-reader',
            label: 'Opened',
            color: 'green',
            query: {
              status: 'opened',
            },
          },
          {
            icon: 'fas fa-calendar',
            label: 'Las 7 days',
            color: 'red',
            query: {
              createdAt: {
                $gt: new Date().getTime() - DAY_MS,
              },
            },
          },
          {
            icon: 'attachment',
            label: 'Has attachment',
            color: 'orange',
            query: {
              attachments: {$ne: []},
            },
          },

        ],
        selectedFilters: [],
        filter: {
          words: '',
          fromDate: '',
          toDate: '',
          hasAttachment: false,

        },
        link: 'inbox',
        showFilters: false,
        showAddFilters: false,
        showInbox: false,
        // checkAll: false,
        // check1: false,
        // check2: false,
        // model: null,
        // options: [],
        // contacts,
        query: {
          subject:
            {
              $regex: '',
              $options: 'igm',
            },
          body:
            {
              $regex: '',
              $options: 'igm',
            },
        },
        openMessage: false,
        openedMessage: undefined,
        openedMessageId: undefined,
        downloading: false,
        msgToEdit: undefined,
        isReply: false,
        dialogTitle: 'New Message',
      };
    },
    watch: {
      link: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal !== 'trash') {
            this.linkQuery = {
              _id: {
                $in: this.$lget(this.$activeAccount, [newVal], []),
              },
            };
          } else {
            this.linkQuery = {
              $and: [
                {
                  _id: {
                    $nin: this.$lget(this.$activeAccount, 'outbox', []).concat(this.$lget(this.$activeAccount, 'inbox', [])),
                  },
                },
                {
                  $or: [
                    {from: this.$lget(this.$activeAccount, '_id')},
                    {to: this.$lget(this.$activeAccount, '_id')},
                  ],
                },
              ],
            };
          }
        },
      },
      filter: {
        deep: true,
        handler(newValue) {

          if (newValue.fromDate) {
            const froUnixTimestamp = Math.floor(new Date(newValue.fromDate).getTime() / 1000);
            console.log(froUnixTimestamp);
          }
          if (newValue.toDate) {
            const toUnixTimestamp = Math.floor(new Date(newValue.toDate).getTime() / 1000);
            console.log(toUnixTimestamp);
          }

          if (newValue.hasAttachment) {
            this.$lset(this.query, 'attachments', {$ne: []});
          } else {
            this.$lunset(this.query, 'attachments');
          }

        },
      },
      columns(newVal) {
        const cols = this.columnsToShowFirst || newVal;
        this.visibleColumns = ['__v', ...cols];
      },
      messages: {
        immediate: true,
        handler(newVal) {
          if (!Array.isArray(newVal) || Array.isArray(newVal) && !newVal[0]) {
            this.columns = [];
          } else {
            const cols = Object.keys(newVal[0]).filter(column => column !== '__v' && column !== '_fastjoin' && column !== 'updatedByHistory' && column !== '_id');
            this.columns = cols.map(col => ({
              label: this.capitalize(this.kebabize(col).replace('-', ' ')),
              value: col,
            }));
            const id = this.$lget(this.$route,['query','openedMessageId']);
            this.openedMessage = newVal.find(msg => msg._id === id);
          }
        },
      },
      messagesTotal: {
        immediate: true,
        handler(newVal, oldVal) {

          if (newVal !== oldVal) {
            this.pagination.rowsPerPage = this.messagesLimit;
            this.pagination.rowsNumber = newVal;
          }
        },
      },

    },

    computed: {
      columnsToShowFirst() {
        if (this.link === 'outbox') {
          return ['to', 'subject', 'body'];
        }
        return ['from', 'subject', 'body'];
      },
      messageLinks() {
        // const  newInbox =  this.messages.filter(message => this.$activeAccount.inbox.includes(message._id) && message.status==='new').length;
        //
        const inbox = this.$lget(this.$activeAccount, 'inbox', []).length;
        const outbox = this.$lget(this.$activeAccount, 'outbox', []).length;
        return [
          {
            icon: 'fas fa-inbox',
            title: 'Inbox',
            path: 'inbox',
            caption: `${inbox} received`,
          },
          {
            icon: 'fas fa-paper-plane',
            title: 'Outbox',
            path: 'outbox',
            caption: `${outbox} sent`,
          },
          {
            icon: 'fas fa-trash-alt',
            title: 'Trash',
            path: 'trash',
          },
        ];
      },

      selectedFilterQuery() {
        let selectedFilterQuery = {};
        this.selectedFilters.map(filter => {
          this.$lmerge(selectedFilterQuery, this.$lget(filter, 'query', {}));
        });
        return selectedFilterQuery;
      },
      searchBoxQuery() {
        const words = this.$lget(this.filter, 'words');

        return {
          $or: [
            {
              subject:
                {
                  $regex: words,
                  $options: 'igm',
                },
            },
            {
              body:
                {
                  $regex: words,
                  $options: 'igm',
                },
            },
          ],
        };
      },
      searchPlaceholder() {
        if (this.link === 'inbox') {
          return this.$q.screen.xs ? 'Search all' : 'Search all conversations';
        }
        const otherSearches = this.link.length > 6 ? '...' : this.link;
        return this.$q.screen.xs ? `Search ${otherSearches}` : `Search ${this.link}`;
      },
      selectAttrs() {
        return {
          'option-value': '_id',
          'option-label': 'name',
          dense: true,
          behavior: 'menu',
          'transition-show': 'fade-in',
          'transition-hide': 'fade-out',
          multiple: true,
          'options-dense': true,
          class: 'text-caption',
          'emit-value': true,
          'map-options': true,
          'options-cover': true,
        };
      },
      params() {

        return {
          // paginate: false,
          ['in-app-messages_fJoinHookResolversQuery']: {
            from: true,
            to: true,
          },
          replyResolversQuery: {
            replies: true,
          },
        };
      },
    },
    methods: {
      capitalize, kebabize, singularize,
      onFilterInput() {
        this.showFilters = true;
        if (this.$q.screen.xs) {
          this.showAddFilters = true;
        }

      },
      toggleSelected(filter) {
        if (this.selectedFilters.some(f => f.label === filter.label)) {
          this.selectedFilters = this.selectedFilters.filter(f => f.label !== filter.label);
        } else {
          this.selectedFilters.push(filter);
        }
      },

      selectedToAccounts(newVal) {
        console.log('selected: ', newVal);
      },
      selectedFroAccounts(newVal) {
        console.log('selected: ', newVal);
      },
      closeFilters() {
        this.showAddFilters = false;
        this.showFilters = false;
      },
      filterMessages() {
        // TODO: search filter
        this.closeFilters();
      },
      saveFilter() {
        // TODO: create new message filter
        this.closeFilters();
      },
      handleSelected(value) {
        if (this.selected.some(item => item._id === this.$lget(value, '_id'))) {
          this.selected = this.selected.filter(item => item._id !== value._id);
        } else {
          this.selected.push(value);
        }

      },
      setPagination(newVal) {
        this.messagesLimit = newVal.pagination.rowsPerPage === 0 ? this['messagesTotal'] : newVal.pagination.rowsPerPage;
        this.messagesCurrentPage = newVal.pagination.page;
        this.pagination = newVal.pagination;

        if (newVal.pagination.sortBy) {
          this.sort = {[newVal.pagination.sortBy]: newVal.pagination.descending ? -1 : 1};
        } else {
          this.sort = {
            status: 'new',
            createdAt: -1,
          };
        }
      },
      onSelectLink(value) {
        this.link = value;
        this.openMessage = false;
        this.openedMessage = undefined;
      },
      onOpenMessage(evt, row) {
        this.openMessage = true;
        this.openedMessageId = row._id;
        this.openedMessage = row;
        if (this.$lget(this.$activeAccount, 'unseenMessages', []).includes(row._id)) {
          this.$activeAccount.patch({
            data: {
              $pull: {
                unseenMessages: row._id,
              },
            },
          }).then(() => {
            console.log(`removed ${row.subject} from unseenTasks`);
          });
        }
      },
      async downloadItem(att) {
        try {
          const url = this.$lget(att, 'path', this.$lget(att, 'href'));
          const label = this.$lget(att, 'filename');
          const ext = label.split('.')[1];
          this.downloading = true;
          const response = await this.$axios.get(url, {responseType: 'blob'});

          const blob = new Blob([response.data], {type: `application/${ext}`});
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = label;
          link.click();
          URL.revokeObjectURL(link.href);
          this.downloading = false;
        } catch (e) {
          this.downloading = false;
          this.$q.notify({
            message: `Download failed: ${e.message}`,
            color: 'negative',
            textColor: 'white',
            icon: 'warning',
          });
        }
      },
      forwardMsg() {
        this.showInbox = true;
        this.msgToEdit = undefined;
        this.dialogTitle = 'Forward Message';
        const {subject, body, attachments} = this.openedMessage;
        this.msgToEdit = {subject, body, attachments};
      },
      replyMsg() {
        this.msgToEdit = undefined;
        this.showInbox = true;
        this.isReply = true;
        this.dialogTitle = 'Reply';
        const isReply = this.isReply;
        const subject = this.$lget(this.openedMessage, 'subject');
        const to = this.$lget(this.openedMessage, ['_fastjoin', 'from', 'email']);
        const _id = this.$lget(this.openedMessage, '_id');
        this.msgToEdit = {_id, to, subject, body: '', isReply};
      },
      closeDialog() {
        this.showInbox = false;
        this.isReply = false;
      },
      openDeleteConfirm(messageToDelete) {
        this.$q.dialog({
          title: 'Delete Message?',
          message: 'Are you sure you want to delete this message?',
          ok: {
            push: true,
            color: 'primary',
          },
          cancel: {
            color: 'negative',
            push: true,
            outline: true,
          },
          persistent: true,
        }).onOk(async () => {
          try {
            const {_id, from, to} = messageToDelete;
            console.log('outbox: ', to, ': ', this.$lget(this.$activeAccount, '_id'));
            // if you are the sender
            if (from === this.$lget(this.$activeAccount, '_id')) {
              const messagesYouSent = this.$lget(this.$activeAccount, 'outbox', []);
              // remove this  from the list of messages you sent
              const outbox = messagesYouSent.filter(id => (id !== _id));
              console.log('outbox: ', outbox);
              await this.$activeAccount.save({
                data: {outbox},
              });
              this.linkQuery = {
                _id: {
                  $in: outbox,
                },
              };
            } else if (to.includes(this.$lget(this.$activeAccount, '_id'))) {
              // if you are the receiver
              const messagesYouReceived = this.$lget(this.$activeAccount, 'inbox', []);
              // remove this  from the list of messages you sent
              const inbox = messagesYouReceived.filter(id => (id !== _id));
              console.log('inbox: ', inbox);
              await this.$activeAccount.save({
                data: {inbox},
              });
              this.linkQuery = {
                _id: {
                  $in: inbox,
                },
              };
            }
            this.messagesRefresh();

            this.$q.notify({
              type: 'positive',
              message: 'Message Deleted',
              timeout: 10000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                  },
                },
              ],
            });
          } catch (err) {
            this.$q.notify({
              type: 'negative',
              message: err.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                  },
                },
              ],
            });
          }

        });


      },
      sent() {
        this.showInbox = false;
        if (this.link !== 'trash') {
          this.linkQuery = {
            _id: {
              $in: this.$lget(this.$activeAccount, [this.link], []),
            },
          };
        } else {
          this.linkQuery = {
            $and: [
              {
                _id: {
                  $nin: this.$lget(this.$activeAccount, 'outbox', []).concat(this.$lget(this.$activeAccount, 'inbox', [])),
                },
              },
              {
                $or: [
                  {from: this.$lget(this.$activeAccount, '_id')},
                  {to: this.$lget(this.$activeAccount, '_id')},
                ],
              },
            ],
          };
        }
        this.messagesRefresh();
      },
    },
  };
</script>

<style scoped lang="scss">
  .filter-scroll-area {
    float: left;
    width: 80%;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }

    .q-chip {
      flex: 0 0 auto;
    }
  }

  .content-area {
    position: absolute;
    top: 0;
    bottom: 2rem;
    width: 96%;
    overflow-x: hidden !important;
    margin-left: -0.4rem;

  }
</style>
