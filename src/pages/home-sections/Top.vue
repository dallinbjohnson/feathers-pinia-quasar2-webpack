<template>
  <div class="top_section bg-white">

    <div class="__inner row">

      <div class="col-12 col-md-6 q-px-md">
        <div class="__text_promo font-2">
          <div style="width: 650px; max-width: 100%; padding: 0 3vw" class="text-xxxl text-mb-xxxl">
            <div class="row items-center">
              <q-btn @click="$scrollTo({ id: 'pricing_main' })" dense :size="$q.screen.lt.md ? 'lg' : 'xl'" flat
                     label="Apply Today" color="primary"
                     icon-right="mdi-arrow-right"></q-btn>
            </div>
            <span>Build an online store <span
              class="underline--magical text-xxl text-mb-xxl text-uppercase">with no</span> &nbsp;</span>
            <transition name="__transition_slide_top">
              <span v-if="textOn" class="text-lowercase __place_text text-weight-bold">{{
                  sections[active].title
                }}</span>
            </transition>
            <div class="row">
              <a style="text-decoration: none; color: var(--q-color-primary)" href="sms:+18019950674">
                <q-btn :size="$q.screen.lt.md ? 'md' : 'lg'" flat dense label="text us: (801) 995-0674"></q-btn>
              </a>
            </div>
          </div>
        </div>
      </div>


      <div class="col-12 col-md-6 q-pa-md">
        <template v-for="(section, i) in sections">
          <div class="__main_promo" :key="`section-${i}`" v-show="active === i">
            <div class="__img">

              <div class="__back_1 bg-primary"></div>
              <div class="__back_2 bg-secondary"></div>
              <flip-transition>
                <div class="__img_container" v-if="active === i">
                  <div class="__cover"></div>
                  <q-img class="fillitup" style="background-size: cover;" :src="section.img"></q-img>
                </div>
              </flip-transition>

            </div>

          </div>
        </template>
      </div>

    </div>
  </div>
</template>

<script>
  import FlipTransition from 'components/common/transitions/FlipTransition';

  export default {
    name: 'Top',
    components: { FlipTransition },
    mounted() {
      this.runActive();
    },
    data() {
      return {
        active: 0,
        textOn: true,
        stop: false,
        runTime: 5000
      };
    },
    computed: {
      sections() {
        return [
          {
            title: 'Inventory',
            img: require('../../assets/icons/package_back.png')
          },
          {
            title: 'Warehouse',
            img: require('../../assets/icons/warehouse_back.png')
          },
          {
            title: 'Logistics',
            img: require('../../assets/icons/logistics_back.png')
          }
        ];
      }
    },
    methods: {
      runActive() {
        if (!this.stop) {
          setTimeout(() => {
            this.textOn = false;
            setTimeout(() => {
              this.active < this.sections.length - 1 ? this.active++ : this.active = 0;
              setTimeout(() => {
                this.textOn = true;
              }, 500);
            }, 100);
            this.runActive();
          }, this.runTime);
        }
      }
    }

  };
</script>

<style scoped lang="scss">

  .top_section {
    width: 100%;
  }

  .__half {
    width: 50%;
    height: 100%;
  }

  .__text_promo {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .__place_text {
    //text-shadow: 2px 2px 0 var(--q-color-secondary), 3px 3px 0 var(--q-color-primary);
    display: inline-block;
  }

  .underline--magical {
    background-image: linear-gradient(120deg, var(--q-color-secondary) 0%, var(--q-color-primary) 100%);
    background-repeat: no-repeat;
    background-size: 100% 0.2em;
    background-position: 0 88%;
    transition: background-size 0.25s ease-in;

    &:hover {
      background-size: 100% 88%;
    }
  }

  .__inner {
    width: 100%;
    min-height: 100vh;
    padding-top: 80px;
    transform: translateY(-80px);
    position: relative;
  }

  .__main_promo {
    //position: absolute;
    //top: 0;
    //left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

  }

  .__img {
    position: relative;
    width: 80%;
    height: 50%;
    min-height: 300px;
    max-width: 90vw;
  }

  .__back_1 {
    position: absolute;
    top: -5%;
    left: -5%;
    width: 110%;
    height: 110%;
    z-index: 1;

  }

  .__back_2 {
    position: absolute;
    top: -5%;
    left: -5%;
    width: 110%;
    height: 110%;
    z-index: 1;
    transform: rotate(-7deg)
  }

  .__img_container {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    z-index: 1;
    overflow: hidden;
    position: relative;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, .3);
    perspective: 1000px;
    transform-style: preserve-3d;
  }

  .__cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background: linear-gradient(196deg, rgba(0, 0, 0, .1), rgba(0, 0, 0, 0));
  }

  .__cover_text {
    z-index: 3;
    position: absolute;
    bottom: 0px;
    left: 20px;
    text-transform: uppercase;
    font-weight: 900;
    //text-shadow: 2px 2px 1px var(--q-color-primary);
    color: white;
  }

  @media screen and (max-width: 1023px) {
    .__main_promo {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: visible;
      padding: 25px 0;
    }
    .__img {
      position: relative;
      width: 100%;
      height: 75%;
    }
    .__text_promo {
      padding-top: 30%;
    }
  }

  .__transition_slide_top-enter-active,
  .__transition_slide_top-leave-active {
    transition: all 0.6s;
  }

  .__transition_slide_top-enter {
    transform: translate(20px, 0);
    opacity: 0;
  }

  .__transition_slide_top-leave-to {
    transform: translate(-20px, 0);
    opacity: 0;
  }

</style>
