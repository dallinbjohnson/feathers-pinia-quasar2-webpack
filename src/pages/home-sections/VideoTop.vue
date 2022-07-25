<template>
  <div class="full-width __top font-2" >
    <video autoplay muted loop class="__vid" :style="vidStyle">
      <source :src="video" type="video/mp4">
    </video>
    <div class="__words text-white text-weight-bolder text-xxl text-mb-xxl text-uppercase text-center">
      <div class="text-center">
        <div class="flex items-center justify-center">
          <div style="white-space: nowrap">Amazon on&nbsp;</div>
          <div class="flex items-center no-wrap">
            <div>auto</div>
            <div class="__flip_wrap">matic
              <div :class="`__flip text-accent ${changing ? 'squish' : ''}`">{{ suffix }}</div>
            </div>
          </div>
        </div>
        <q-btn @click="$emit('start')" push color="secondary" text-color="white" label="Let us drive"></q-btn>
      </div>
    </div>
    <div class="__cover"></div>
    <svg class="__round" style="transform: rotate(180deg) translate(0, -80px); z-index: 5; height: 30vh;" width="800" height="80" viewBox="0 0 500 80"
         preserveAspectRatio="none">
      <path d="M0,0 L0,40 Q 250,80 500,40 L500,0 Z" fill="white"/>
    </svg>
  </div>
</template>


<script>
  export default {
    name: 'VideoTop',
    mounted() {
      const run = () => {
        this.changing = true;
        setTimeout(() => {
          this.count < this.suffixes.length - 1 ? this.count++ : this.count = 0;
        }, 500);
        setTimeout(() => {
          this.changing = false;
          setTimeout(() => {
            run();
          }, this.timeout);
        }, 2000);
      };
      run();
      this.w = window.innerWidth;
      this.h = window.innerHeight;
      window.addEventListener('resize', () => {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
      });
    },
    data() {
      return {
        timeout: 5000,
        pace: 2000,
        suffixes: ['matic', 'pilot', '-pay'],
        count: 0,
        changing: false,
        w: 600,
        h: 1000
      };
    },
    computed: {
      vidStyle(){
        let w = Math.max(this.w, 1000);
        return {
          height: Math.max(this.h, w * (9/16)) + 'px',
          width: w + 'px',
          left: (Math.max(0, 1000 - this.w) * -.5) + 'px'
        };
      },
      suffix() {
        return this.suffixes[this.count];
      },
      video() {
        return 'https://firebasestorage.googleapis.com/v0/b/boxfin-1d426.appspot.com/o/final_62296545f2a7190e20496c97_972193.mp4?alt=media&token=829c620c-0bf2-4ac5-9baf-68e327d785ee';
      }
    }
  };
</script>

<style scoped lang="scss">
  .__top {
    padding: 0 10vh;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
    transform: translate(0, -80px);
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .__cover,
  .__vid {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1;
  }


  .__cover {
    z-index: 2;
    background: rgba(0, 0, 0, .7);
  }

  .__round {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 3;
  }

  .__words {
    position: absolute;
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
  }

  .__flip_wrap {
    position: relative;
    color: transparent;
  }

  .__flip {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    white-space: nowrap;
    text-align: left;
  }


  .squish {
    animation: wipe-enter 1s 1
  }

  .unsquish {
    animation: wipe-enter 1s 1
  }

  @keyframes wipe-enter {
    0% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1, 0) translate(0, 100%);
    }
  }

  @keyframes wipe-leave {
    0% {
      transform: scale(1, .025);
    }
    50% {
      transform: scale(0, .025);
    }
  }
</style>
