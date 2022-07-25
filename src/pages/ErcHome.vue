<template>
  <div id="ErcHome">
    <div>
      <erc-hero></erc-hero>
    </div>

    <div class="row q-pa-md-xl justify-md-evenly"
         :style="{flexDirection: $q.screen.lt.md ? 'column-reverse' : 'unset'}">
      <div class="col-12 col-md-6 q-pa-xl column justify-between items-start"
           :style="{height: $q.screen.gt.sm ? '400px' : 'unset', maxWidth: '750px', flexWrap: 'nowrap'}">
        <q-intersection once transition="jump-right">
          <h2 class="q-ma-none" style="font-weight: 500; font-size: clamp(35px, 8vw, 50px)">
            There’s no risk. Only reward. And the application is free.
          </h2>
        </q-intersection>
        <q-intersection once transition="jump-right">
          <h5 class="q-ma-md-none">Why not just see what happens? Worst case scenario, your business does not qualify,
            you will have lost $0, and you will know you’ve done all you can to ensure your business is a success.</h5>
        </q-intersection>
        <q-intersection once transition="jump-right">
          <q-btn @click="contactDialog = true" size="lg" color="primary">Get Started</q-btn>
        </q-intersection>
      </div>

      <div class="col-12 col-md-6"
           :style="[{maxWidth: $q.screen.gt.sm ? '700px' : 'unset'}, {padding: $q.screen.gt.sm ? 'unset' : $q.screen.gt.xs ? '0 20vw' : 'unset'}]">
        <q-intersection :threshold="0.5" once transition="jump-left">
          <q-img src="../assets/svgs/golden_coin_stack.svg" style="min-height: 250px; max-height: 400px"/>
        </q-intersection>
      </div>
    </div>

    <div class="q-my-xl">
      <div class="full-height full-width row">
        <div class="col-md-6 col-12 text-white q-pa-xl bg-primary">
          <h3 style="font-weight: 500">What is it?</h3>
          <h5>
            The ERC is a tax credit (not a loan) from the IRS for business owners who could use some relief from
            COVID. Every business in the US may qualify!
          </h5>
        </div>
        <div class="col-md-6 col-12 text-white q-pa-xl bg-secondary">
          <h3 style="font-weight: 500">Why?</h3>
          <h5>
            Businesses pay employees. Employees sustain the economy. They also pay taxes. The Fed wants to pay you, so
            you can keep paying employees, so they can keep paying others.
          </h5>
        </div>
      </div>
    </div>

    <div class="q-pa-md-xl q-pa-md" style="max-width: 1000px; margin: auto">
      <h2 class="q-ma-none text-center" style="font-weight: 500; font-size: clamp(35px, 8vw, 50px)">
        Payment Options
      </h2>
      <h4 class="text-center">
        No cost if you don’t qualify.<br>
        Payment is only required if you receive the credit.<br>
        We are the lowest in the industry.
      </h4>

      <q-intersection :threshold="0.5" once transition="jump-left" style="min-height: 150px">
        <div class="flex justify-md-start justify-center items-center q-my-xl">
          <q-img :class="['q-mr-md', $q.screen.lt.sm ? 'q-mb-lg' : '']"
                 src="../assets/svgs/five-percent.svg"
                 height="100"
                 width="100px"/>
          <div style="width: 500px" :class="$q.screen.lt.sm ? 'text-center' : ''">
            <h4 class="no-margin" style="font-weight: 500; font-size: clamp(20px, 10vw, 25px)">
              Direct - 5% immediately
            </h4>
            <p class="no-margin" style="font-size: 15px">
              You pay us 5% up front before filing <u><i>only if you qualify for ERC.</i></u> Aka, we have removed ALL
              RISK.
            </p>
          </div>
        </div>
      </q-intersection>
      <q-intersection :threshold="0.5" once transition="jump-left" style="min-height: 150px">
        <div class="flex justify-md-center justify-center items-center q-my-xl">
          <q-img :class="['q-mr-md', $q.screen.lt.sm ? 'q-mb-lg' : '']"
                 src="../assets/svgs/eight-percent.svg"
                 height="100"
                 width="100px"/>
          <div style="width: 500px" :class="$q.screen.lt.sm ? 'text-center' : ''">
            <h4 class="no-margin" style="font-weight: 500; font-size: clamp(20px, 10vw, 25px)">
              Deferred - 8% 6-month
            </h4>
            <p class="no-margin" style="font-size: 15px">
              8% pay over 6 months, first payment required before filing.
            </p>
          </div>
        </div>
      </q-intersection>
      <q-intersection :threshold="0.5" once transition="jump-left" style="min-height: 150px">
        <div class="flex justify-md-end justify-center items-center q-my-xl">
          <!--          <div class="bg-primary q-mr-md" style="width: 100px; height: 100px; border-radius: 50%"></div>-->
          <q-img :class="['q-mr-md', $q.screen.lt.sm ? 'q-mb-lg' : '']"
                 src="../assets/svgs/twelve-percent.svg"
                 height="100"
                 width="100px"/>
          <div style="width: 500px" :class="$q.screen.lt.sm ? 'text-center' : ''">
            <h4 class="no-margin" style="font-weight: 500; font-size: clamp(20px, 10vw, 25px)">
              Delayed - 12% after cash is received
            </h4>
            <p class="no-margin" style="font-size: 15px">
              12% to be paid upon receiving the credit, but must complete an application prior to filing.
            </p>
          </div>
        </div>
      </q-intersection>
    </div>

    <!--    <div class="row q-pa-md-xl justify-md-evenly bg-accent">-->
    <!--      <div class="col-12 col-md-6" :style="{maxWidth: $q.screen.gt.sm ? '700px' : 'unset'}">-->
    <!--        <q-intersection :threshold="0.5" once transition="jump-right">-->
    <!--          <q-img src="../assets/black-clock-face.jpg" style="min-height: 250px; max-height: 400px;"/>-->
    <!--        </q-intersection>-->
    <!--      </div>-->

    <!--      <div class="col-12 col-md-6 q-pa-xl column justify-evenly items-start"-->
    <!--           :style="{height: $q.screen.gt.sm ? '400px' : 'unset', maxWidth: '750px', flexWrap: 'nowrap'}">-->
    <!--        <q-intersection once transition="jump-left">-->
    <!--          <h2 class="q-ma-none text-white" style="font-weight: 500; font-size: clamp(35px, 8vw, 50px)">-->
    <!--            Time is running out!-->
    <!--          </h2>-->
    <!--        </q-intersection>-->
    <!--        <q-intersection once transition="jump-left">-->
    <!--          <h5 class="q-ma-md-none text-white">-->
    <!--            Act quick cause they'll stop giving it out soon (placeholder text) Act quick cause they'll stop giving it-->
    <!--            out soon (placeholder text)-->
    <!--          </h5>-->
    <!--        </q-intersection>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="clock-image">
      <div class="full-height full-width row" style="background-image: linear-gradient(to right, black, transparent);">
        <div class="col-md-6 col-12 text-white column justify-center"
             :style="[{padding: $q.screen.lt.md ? '100px 50px' : '150px 100px'}, {'text-shadow': '2px 2px 4px black'}]">
          <h1 class="no-margin" style="font-weight: 500; font-size: clamp(35px, 8vw, 50px)">Time is running out!</h1>
          <h5 class="q-pa-none q-pt-sm">
            The ERC program is finite. In other words, the clock is ticking. The IRS will phase out this program as
            funds become limited (it's already begun), so the longer you wait, the less money you will receive. With no
            risk, there is no reason not to START TODAY!
          </h5>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>

    <div class="row">
      <div class="q-pa-xl col-md-8 col-12">
        <erc-contact-form></erc-contact-form>
      </div>
      <div class="q-pa-xl col-md-4 col-12 bg-primary text-white">
        <h2 style="font-weight: 500; font-size: clamp(35px, 8vw, 50px)">Contact us</h2>
        <a href="mailto: support@jslatin.com" style="text-decoration: none; color: inherit">
          <h4 class="q-ma-none">support@jslatin.com</h4>
        </a>
        <a href="tel: (801) 396-0121" style="text-decoration: none; color: inherit">
          <h4 class="q-ma-none q-mb-xl">(801) 369-0121</h4>
        </a>
      </div>
    </div>

    <q-dialog v-model="contactDialog">
      <q-card style="max-width: 1000px;">
        <q-btn icon="close" dense flat v-close-popup style="position: absolute; top: 10px; right: 10px"/>
        <erc-contact-form filled></erc-contact-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import ErcContactForm from 'components/ErcSite/ErcContactForm';
  import ErcHero from 'components/ErcSite/ErcHero';

  export default {
    name: 'ErcHome',
    components: {ErcHero, ErcContactForm},
    data() {
      return {
        contactDialog: false,
      };
    },
  };
</script>

<style scoped lang="scss">
  #ErcHome {
    .clock-image {
      background-image: url("../assets/black-clock-face.jpg");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    .why-image {
      background-color: var(--q-color-accent);
      background-image: url("../assets/svgs/131Z_coin_19.svg");
      background-repeat: no-repeat;
      background-size: 250px;
      background-position: center;
    }
  }
</style>
