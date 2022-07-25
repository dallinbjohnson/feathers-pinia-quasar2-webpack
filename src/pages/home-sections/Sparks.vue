<template>
  <div class="__sparks bg-primary row items-center" style="z-index: 5">

    <div class="row full-width">
      <div class="col-12 col-md-6 halfs">

        <div :class="`row justify-${$q.screen.lt.md ? 'center' : 'end'}`">
          <div class="__box">
            <div class="font-2 text-xxl text-mb-xxl text-weight-bold text-white">Why <span
              class="__build text-uppercase text-xl text-mb-xl">build</span> with <span
              class="text-uppercase text-xl text-mb-xl text-secondary">byld</span>
            </div>
            <div class="text-md text-mb-md text-white">E-commerce is a young and complex industry. We have created a system for solving simple inefficiencies in how orders are fulfilled when people buy from online platforms like Amazon. From drop ship to arbitrage, our process finds the automatic opportunity in the chaos. Our process brings efficiency to the marketplace, value to the end consumer, and wealth to our partners.<br><br>We
              are partnering with new entrepreneurs every day.
            </div>
            <div class="q-pt-md" v-if="$q.screen.gt.sm">
              <q-btn @click="$emit('open')" color="secondary" label="Get Started" icon-right="mdi-chevron-right"></q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 halfs">
        <div :class="`flex justify-${$q.screen.lt.md ? 'center' : 'start'} items-center full-width full-height`">
          <div class="__collage">
            <div class="row">
              <div :class="colClass">
                <div class="imgs you flex flex-center bg-white">

                  <byld-logo style="height: 50px; width: 50px"></byld-logo>

                </div>
              </div>
              <div :class="colClass">
                <div class="imgs flex flex-center bg-white">
                  <div class="you text-center text-lg text-mb-lg text-primary text-uppercase">
                    +You
                  </div>
                </div>
              </div>
              <div :class="colClass">
                <q-img class="imgs" :src="two"></q-img>
              </div>

              <div :class="colClass">
                <q-img class="imgs" :src="three"></q-img>
              </div>
              <div :class="colClass">
                <q-img class="imgs" :src="one"></q-img>
              </div>


              <div :class="colClass">
                <div class="imgs flex flex-center bg-white">
                  <div class="text-center text-xl text-mb-xl text-weight-bolder text-primary">=🔥</div>
                </div>
              </div>
            </div>
            <div class="row" v-if="$q.screen.lt.md">
              <div class="q-pt-md">
                <q-btn @click="$emit('open')" color="accent" label="Get Started" icon-right="mdi-chevron-right"></q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import ByldLogo from 'assets/svgs/ByldLogo';

  export default {
    name: 'Sparks',
    components: { ByldLogo },
    data() {
      const one = require('../../assets/sparks/cat.png');
      const two = require('../../assets/sparks/mitch.png');
      const three = require('../../assets/sparks/three.png');
      const seven = require('../../assets/sparks/seven.png');

      return {
        colClass: 'col-4 q-pa-sm',
        one,
        two,
        three,
        seven
      };
    },
    computed: {}
  };
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,300;1,400&display=swap');

  .you {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
  }

  .__sparks {
    width: 100%;
    padding: 10vh 10px;
    min-height: 100vh;
    //background: linear-gradient(16deg, var(--q-color-accent), var(--q-color-primary));
  }

  .halfs {
    padding: 2vw;
  }

  .__box {
    width: 700px;
    max-width: 100%;
  }

  .__collage {
    width: 650px;
    height: 400px;
    max-width: 100%;
    max-height: 95vw;
  }

  .imgs {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  .__img_wrap {
    width: 100%;
    height: 190px;
    max-height: 45vw;
    border-radius: 5px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, .25);
    overflow: hidden;
  }

  .__build {
    text-shadow: 2px 2px 1px var(--q-color-accent);
  }
</style>
