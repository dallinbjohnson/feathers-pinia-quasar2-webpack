<template>
  <q-layout view="hHh lpR fff">
    <q-header :bordered="scrollY > 500"
              :elevated="scrollY > 500"
              :class="scrollY > 500 ? 'bg-white' : 'bg-transparent'"
              style="transition: all 200ms ease-out">
      <q-toolbar style="height: 75px; transition: all 100ms ease-out">
        <div class="full-width row items-center">
          <q-btn flat padding="0" color="primary" class="q-ml-sm-lg">
            <template v-if="$route.name === 'home'">
              <q-img v-if="scrollY > 500"
                     style="width: clamp(20px, 12vw, 75px); transition: all 100ms ease-out"
                     :src="logo"></q-img>
            </template>
            <template v-else>
              <q-img @click="$routerPreserve({name: 'home'})"
                     style="width: clamp(100px, 12vw, 125px); transition: all 100ms ease-out"
                     :src="logo"></q-img>
            </template>
          </q-btn>
          <q-space/>
<!--          <div v-if="$q.screen.gt.sm">-->
<!--            <q-btn style="transition: all 100ms ease-out" size="md" :color="scrollY > 500 ? 'primary' : 'white'" flat-->
<!--                   label="ERC Credit"></q-btn>-->
<!--            <q-btn style="transition: all 100ms ease-out" size="md" :color="scrollY > 500 ? 'primary' : 'white'" flat-->
<!--                   label="Partners"></q-btn>-->
<!--            <q-btn style="transition: all 100ms ease-out" size="md" :color="scrollY > 500 ? 'primary' : 'white'" flat-->
<!--                   label="Contact Us"></q-btn>-->
<!--            &lt;!&ndash;            <q-btn v-if="$lisEmpty($authUser)" @click="clickers('login')" :style="btnStyle" :size="btnSz" icon="mdi-finance"&ndash;&gt;-->
<!--            &lt;!&ndash;                   color="primary" rounded push label="Login"></q-btn>&ndash;&gt;-->
<!--            &lt;!&ndash;            <q-btn v-if="!$lisEmpty($authUser)" @click="clickers('logout')" :style="btnStyle" :size="btnSz"&ndash;&gt;-->
<!--            &lt;!&ndash;                   icon="mdi-finance"&ndash;&gt;-->
<!--            &lt;!&ndash;                   color="primary" rounded push label="Logout"></q-btn>&ndash;&gt;-->
<!--          </div>-->
<!--          <div v-else>-->
<!--            <q-btn flat color="primary" icon="mdi-menu">-->
<!--              <q-menu>-->
<!--                <q-list>-->
<!--                  <q-item-->
<!--                    v-for="item in [ 'about', 'results', 'contact'/*, `${$lisEmpty($authUser) ? 'login' : 'logout'}`*/]"-->
<!--                    :key="item" clickable-->
<!--                    @click="clickers(item)">-->
<!--                    <q-item-section>-->
<!--                      <q-item-label header class="text-uppercase">{{ item }}</q-item-label>-->
<!--                    </q-item-section>-->
<!--                  </q-item>-->
<!--                </q-list>-->
<!--              </q-menu>-->
<!--            </q-btn>-->
<!--          </div>-->
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :key="$route.path"/>
    </q-page-container>

    <q-footer>
      <div class="bg-dark" style="padding: 20px 5%">
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <div class="row justify-center">
              <q-img style="width: clamp(100px, 12vw, 150px)"
                     :src="logo_dark"></q-img>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="row justify-center items-center">
              <div class="text-xxs text-mb-xxs text-weight-medium text-white">
                <div class="flex">
                  <div class="q-mr-xs">
                    <q-icon color="white" size="16px" name="mdi-phone"></q-icon>
                  </div>
                  <div>(801)396-0121</div>
                </div>
                <div class="flex" style="padding: 3px 0">
                  <div class="q-mr-xs">
                    <q-icon color="white" size="16px" name="mdi-email"></q-icon>
                  </div>
                  <div>support@jslatin.com</div>
                </div>
                <div class="flex" style="padding: 3px 0">
                  <div class="q-mr-xs">
                    <q-icon color="white" size="16px" name="mdi-map-marker"></q-icon>
                  </div>
                  <div>2015 Grove Pkwy, Ste G, Pleasant Grove, UT, 84062</div>
                </div>
                <div style="padding: 3px 0">JS Latin LLC&copy; <span class="text-weight-light text-xxxs text-mb-xxxs">all rights reserved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
  export default {
    name: 'ErcLayout',
    mixins: [],
    components: {},
    data() {
      return {
        scrollY: 0,
      };
    },
    mounted() {
      window.addEventListener('scroll', () => {
        this.scrollY = window.scrollY;
      });
    },
    computed: {
      contact() {
        return {
          email: 'support@website-builder.com',
          phone: '+18019950674',
        };
      },
      logo_dark() {
        // let logo = require('../assets/logos/byld_iconalt_white.png');
        // let logo = 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/js+latin/js_latin_white.svg';
        let logo = require('../assets/svgs/taxBox_logo_white.svg');
        return logo;
      },
      logo() {
        // let logo = require('../assets/logos/byld_iconalt.png');
        // let logo = 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/js_latin_full.svg';
        let logo = require('../assets/svgs/taxBox_logo.svg');
        return logo;
      },
      fullLogo() {
        return require('../assets/logos/bc_full_white.png');
      },
    },
    methods: {},

  };
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,300;1,400&display=swap');

  body::v-deep {
    .q-page-container {
      padding-top: 0 !important;
    }
  }

  body {
    background: black;
    font-family: 'Poppins', sans-serif;
  }

  .__logo {
    position: fixed;
    transition: all .3s ease-out;
  }

  .top_logo {
    top: 90px;
    left: 50%;
    transform: translate(-50%, 0);
    //background: var(--q-color-primary);
    //background: rgba(255,255,255,.3);
    border-radius: 10px;
    width: 150px;
    height: 150px;
    //box-shadow: 0px 2px 6px rgba(0,0,0,.2);
    padding-bottom: 10px;
  }

  .sm_logo {
    width: 85px;
  }

</style>
