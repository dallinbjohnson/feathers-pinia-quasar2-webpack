<template>
  <div id="ErcHomeAlt">
    <div id="area1" style="height: 600px;">
      <div class="full-height full-width row" style="background-image: linear-gradient(to right, white, transparent);">
        <div class="col-6 text-black" style="padding: 100px;">
          <!--          <h1 style="font-weight: 500">This is some important text about JS Latin</h1>-->
          <!--          <h5>this is some informative text about JS Latin, this is some informative text about-->
          <!--            JS Latin, this is some informative text about JS Latin, this is some informative text about JS Latin</h5>-->
          <h1 style="font-weight: 500">Reclaim the money your business has been missing</h1>
          <h5>Our team of experts is making it easier than ever for you to claim your missing stimulus money. Find out
            how much money you've been missing out on.</h5>
          <q-btn size="lg" color="white" text-color="black">Get Started</q-btn>
        </div>
      </div>
    </div>
    <!--    <div id="area2" style="height: 600px;">-->
    <!--      <div class="full-height full-width row" style="background-image: linear-gradient(to left, black, transparent);">-->
    <!--        <div class="col-6"></div>-->
    <!--        <div class="col-6 text-white" style="padding: 100px;">-->
    <!--          <h1 style="font-weight: 500">This is some different important information about JS Latin</h1>-->
    <!--          <h5>this is some informative text about JS Latin, this is some informative text about-->
    <!--            JS Latin, this is some informative text about JS Latin, this is some informative text about JS Latin</h5>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <q-parallax style="height: 600px;" :speed="0.8" src="https://ha6755ad-images.s3-us-west-1.amazonaws.com/js+latin/inventory.png">
      <div class="full-height full-width row" style="background-image: linear-gradient(to left, black, transparent);">
        <div class="col-6"></div>
        <div class="col-6 text-white" style="padding: 100px;">
          <h1 style="font-weight: 500">This is some different important information about JS Latin</h1>
          <h5>this is some informative text about JS Latin, this is some informative text about
            JS Latin, this is some informative text about JS Latin, this is some informative text about JS Latin</h5>
        </div>
      </div>
    </q-parallax>
    <div style="padding: 15vh 0">
      <div class="row justify-center text-center">
        <div>
          <div class="text-xl text-mb-xl text-weight-bolder">
            COVID won't kill the small business
            <q-separator class="q-my-md"></q-separator>
          </div>
          <div class="text-sm text-mb-sm">
            Not if we have anything to say about it
          </div>
        </div>
      </div>

      <div class="row justify-center q-py-md">
        <div style="width: 80px; height: 10px; border-radius: 10px;" class="bg-primary"></div>
      </div>

      <div class="row justify-center">
        <div class="text-sm text-mb-sm text-weight-light" style="width: 1000px; max-width: 100%; padding: 30px 4vw">
          Yes, there is an unprecedented and absurd amount of money being handed out by our government due to COVID 19.
          No, we aren't happy about all of the implications it holds for the future. Despite all of that, the relative
          amount of funds going to small businesses is very small.<br><br>
          It is our goal to help small businesses understand all of the funds that are legally being made available to
          them in this unusual situation, and then to ensure they can follow through to claim all of those funds. We
          want to see the maximum amount of this money land with small business owners.
        </div>
      </div>

      <div class="q-py-xl row justify-center">
        <q-btn @click="$routerPreserve({name: 'erctest'})" size="lg" push color="primary" label="Learn More"></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ErcHomeAlt',
  };
</script>

<style scoped lang="scss">
  #ErcHomeAlt {
    #area1 {
      background-image: url("https://ha6755ad-images.s3-us-west-1.amazonaws.com/saveco/rayraybackground_md-01.svg");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }

    #area2 {
      background-image: url("https://ha6755ad-images.s3-us-west-1.amazonaws.com/js+latin/inventory.png");
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
  }
</style>
