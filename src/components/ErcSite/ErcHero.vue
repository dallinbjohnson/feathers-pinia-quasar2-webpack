<template>
  <div id="ErcHero" style="position: relative; height: 900px;">
    <q-parallax style="height: 900px; position: absolute; top: -75px; left: 0;" :speed="$q.screen.width < 1650 ? 0.3 : 0.7">
      <template v-slot:media>
        <img src="../../assets/casual-business-man-working-with-laptop.jpg" alt="homepage image">
      </template>

      <template v-slot:content="scope">
        <div class="full-width full-height" style="background-color: rgba(var(--q-color-primary-rgb), 0.5)">
          <div
            class="absolute column items-center"
            :style="{
            opacity: 0.45 + (1 - scope.percentScrolled) * 1.5,
            top: (scope.percentScrolled * 35) + '%',
            left: 0,
            right: 0
          }"
          >
            <img src="../../assets/svgs/taxBox_logo_white.svg"
                 style="width: clamp(200px, 60vw, 350px);">
          </div>
        </div>
      </template>
    </q-parallax>

    <div class="curve-and-card">
      <svg class="__round" style="transform: rotate(180deg); z-index: 0; height: 350px;" width="800"
           height="80" viewBox="0 0 500 80"
           preserveAspectRatio="none">
        <path d="M0,0 L0,40 Q 250,80 500,40 L500,0 Z" fill="white"/>
      </svg>

      <q-card class="q-pa-xl" :style="[{'max-width': $q.screen.gt.xs ? '75vw' : '300px'}, {margin: 'auto'}, {top: $q.screen.gt.xs ? '-75px' : '0'}]">
        <timeline-counts></timeline-counts>
      </q-card>
    </div>
  </div>
</template>

<script>
  import TimelineCounts from 'components/ErcSite/TimelineCounts';

  export default {
    name: 'ErcHero',
    components: {TimelineCounts},
  };
</script>

<style scoped lang="scss">
  #ErcHero {
    position: relative;

    .curve-and-card {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
    .__round {
      position: absolute;
      bottom: -1px;
      width: 100%;
    }
  }
</style>
