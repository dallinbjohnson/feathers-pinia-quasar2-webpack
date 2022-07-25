<template>
  <div class="sidebar-wrapper" :style="{backgroundColor: dark ? $lightenHex('--q-color-dark', 30) : ''}">
    <div class="title" v-if="title" :style="{color: dark ? '#ffffff' : '#000000'}">
      {{ title }}
    </div>

    <slot name="user">

    </slot>

    <div class="search" style="width: 90%; margin: 0 auto;">
      <q-input v-model="searchInputVal" label="Search admin" filled rounded outlined :color="dark ? 'white' : '#7a7d7f'" :label-color="dark ? 'white' : '#7a7d7f'">
        <template v-slot:prepend>
          <q-icon :color="dark ? 'white' : '#7a7d7f'" class="q-ml-sm" name="fas fa-search" size="xs"/>
        </template>
        <template v-slot:append>
          <q-icon :color="dark ? 'white' : '#7a7d7f'" class="q-mr-sm cursor-pointer" name="fas fa-times" size="xs" @click="searchInputVal = ''" />
        </template>
      </q-input>
    </div>

    <div class="links-wrapper">
      <div v-for="(link, idx) of finalLinks" :key="idx">
        <div class="link" v-if="$lget(link, 'childrenRoutes', []).length && link.$can">
          <div  style="justify-content: space-between"
               @click="setOpen(link)">
            <div style="display: flex; align-items: center;">
              <div class="icon" v-if="link.icon">
                <q-icon :style="{color: dark ? '#ffffff' : link.iconColor ? link.iconColor : '#7a7d7f'}" :name="link.icon"/>
              </div>
              <div class="name">
                <span :style="{color: dark ? '#ffffff' : link.textColor ? link.textColor : '#535557'}">{{ link.title }}</span>
              </div>
            </div>
            <div class="chevron q-mr-md">
              <q-icon v-if="!isSearching" :id="`expand-icon${idx}`" size="sm"
                      :style="{color: dark ? '#ffffff' : '#7a7d7f'}"
                      :name="link.open ? 'expand_less' : 'expand_more'"/>
            </div>
          </div>

          <div v-for="(child, i) of link.childrenRoutes" :key="i" class="children" :id="`nav-item${idx}`"
               :class="link.open ? 'show-menus-list' : 'hide-menus-list'">
            <div v-if="child.$can" :class="$route.path.startsWith(`/admin/${child.routeTo}`) ? (dark === true ? 'active-dark' : 'active') : ''"
                 @click="navToLink(child)"
                 :style="{color: dark ? '#ffffff' : '#535557', padding: child.icon ? '7px 5px 7px 10px' : '10px 5px 10px 20px', display: 'flex', alignItems: 'center'}"
                 class="child-route">
              <div class="icon">
                <q-icon v-if="child.icon" :style="{color: dark ? '#ffffff' : child.iconColor ? child.iconColor : '#7a7d7f'}" :name="child.icon"/>
              </div>
              <div class="name">
                <span :style="{color: dark ? '#ffffff' : child.textColor ? child.textColor : '#535557'}">{{ child.title }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else @click="navToLink(link)" class="single-link"
             :class="$route.path.startsWith(`/admin/${link.routeTo}`) ? (dark === true ? 'active-dark' : 'active') : ''">
          <div class="icon">
            <q-icon v-if="link.icon" :style="{color: dark ? '#ffffff' : '#7a7d7f'}" :name="link.icon"/>
          </div>
          <div :style="{color: dark ? '#ffffff' : '#535557'}" class="name">
            <span>{{ link.title }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Links',
    props: {
      title: {
        type: String,
      },
      linksConfig: {
        type: Array,
      },
      sidebarBackground: {
        type: String,
      },
      dark: {
        type: Boolean,
        default: false,
      },
      defaultRoute: {
        type: Object,
        // required: true
      }
    },
    data() {
      return {
        links: this.linksConfig.map(link => {
          return link.childrenRoutes ? {...link, open: false} : {...link};
        }),
        test: true,
        searchInputVal: '',
      };
    },

    mounted() {
      if(this.$route.path === '/admin' || this.$route.path === '/admin/') {
        this.$router.push({name: `admin-${this.defaultRoute.routeTo}`, query: {page: this.defaultRoute.routeTo}});
      }
      let sty = document.styleSheets[0];
      let col = this.$lightenHex('--q-color-dark', 60);
      sty.insertRule(`.active-dark {background-color: ${col};}`);
      this.links.forEach((link, idx) => {
        if (this.$lget(link, 'childrenRoutes', []).length) {
          return link.childrenRoutes.map(child => {
            if (this.$route.path.startsWith(`/admin/${child.routeTo}`)) {
              this.links[idx].open = true;
            }
          });
        }
      });
    },
    computed: {
      isSearching() {
        return this.searchInputVal.length > 0;
      },
      finalLinks() {
        if (this.isSearching) {
          let newLinks = Object.assign([], this.links);
          let links = newLinks.map((link) => {
            link = Object.assign({}, link);
            let title = link.title.toLowerCase().replace(/\s/g, '');
            let formattedSearch = this.searchInputVal.toLowerCase().replace(/\s/g, '');
            if (title.includes(formattedSearch)) {
              if(this.$lget(link, 'childrenRoutes')) link.open = true;
              return link;
            }
            if (this.$lget(link, 'childrenRoutes')) {
              let childs = link.childrenRoutes.filter(child => {
                let childTitle = child.title.toLowerCase().replace(/\s/g, '');
                if (childTitle.includes(formattedSearch)) return child;
              });
              link.childrenRoutes = childs;
              link.open = true;
              if (!title.includes(formattedSearch) && childs.length) {
                return link;
              }
            }
          }).filter(a => typeof a !== 'undefined');
          return links;
        } else {
          return this.links;
        };
      },
    },
    methods: {
      setOpen(link) {
        link.open = !link.open;
      },
      navToLink(link) {
        if (this.$route.path !== `/admin/${link.routeTo}`) {
          this.$router.replace({path: `/admin/${link.routeTo}`, query: {page: link.routeTo}});
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  @keyframes animLight {
    from {
      background-color: #e2e5ed50
    }
    to {
      background-color: #cdd3df
    }
  }

  .link > div:not(.children), .single-link {
    transition: 0.2s all;
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    padding: 7px 5px 7px 15px;
    border-bottom: 1px solid #dadfea50;
    border-top: 1px solid #dadfea50;
    border-radius: 3px;
    cursor: pointer;

    .icon {
      font-size: 1.5em;
      margin-bottom: 3px;
      vertical-align: center;
      margin-right: 20px;
    }

    .name {
      font-size: 1em;
      font-weight: 300;
    }
  }

  .link > div:not(.active, .active-dark, .children):hover {
    background-color: #e2e5ed50;
    border-color: #6c9adf;
  }

  .active {
    transition: 0.2s all;
    background-color: #cdd3df;
    animation: 0.4s animLight;
  }

  .active-dark {
    transition: 0.2s all;
    //animation: 0.4s animDark;
  }

  .title {
    text-align: center;
    padding-top: 30px;
    font-size: 1.5em;
  }

  .sidebar-wrapper::-webkit-scrollbar {
    display: none;
  }

  .sidebar-wrapper {
    z-index: 10;
    overflow-y: scroll;
    height: 100vh;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);

    .user-wrapper {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      padding-top: 25px;

      .profile-picture {
        text-align: center;
        width: 100%;
      }

      .profile-picture img {
        border-radius: 100%;
        width: 100px;
        height: 100px;
        object-fit: cover;
        text-align: center;
      }

      .name {
        font-weight: 550;
        margin-top: 15px;
        font-size: 1.2em;
      }

      .role {
        font-weight: 300;
      }
    }

    .links-wrapper {
      margin-top: 20px;

      //.link:first-child > div {
      //  border-top: 1px solid #dadfea;
      //}
    }
  }

  .expandable {
    display: flex;
    justify-content: space-between;
  }

  .children {
    .child-route {
      transition: 0.2s all;
      width: 90%;
      margin-left: auto;
      padding: 10px 5px 10px 15px;
      //border-bottom: 1px solid #f1f1f1;
      //border-top: 1px solid #f1f1f1;
      border-radius: 3px;
      cursor: pointer;

      .icon {
        font-size: 1.5em;
        margin-bottom: 3px;
        vertical-align: center;
        margin-right: 20px;
      }

      .name {
        font-size: 1.03em;
        font-weight: 300;
      }
    }

    .child-route:not(.active):hover {
      background-color: #e2e5ed50;
      border-color: #6c9adf;
    }
  }

  .hide-menu-list {
    display: none;
  }

  .show-menu-list {
    display: block;
  }
</style>
