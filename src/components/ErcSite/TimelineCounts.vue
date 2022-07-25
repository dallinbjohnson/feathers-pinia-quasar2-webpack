<template>
  <div class="row full-width full-height">
    <div class="col-md-4 col-sm-6 col-12 column justify-center items-center">
      <h1 id="business-count" class="text-primary q-ma-none"
          style="font-weight: 500; font-size: clamp(40px, 5vw, 60px)">
        {{
          businessesReached > 9999 ?
            Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(businessesReached)
            : Intl.NumberFormat().format(businessesReached)
        }}
      </h1>
      <h4 class="q-ma-none q-mt-md-lg text-center" style="font-size: clamp(18px, 2vw, 25px)">Businesses Reached</h4>
    </div>
    <div :class="['col-md-4 col-sm-6 col-12 column justify-center items-center', $q.screen.lt.sm ? 'q-mt-lg' : '']">
      <h1 id="credit-count" class="text-primary q-ma-none" style="font-weight: 500; font-size: clamp(40px, 5vw, 60px)">
        ${{
          creditsClaimed > 9999 ?
            Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(creditsClaimed)
            : Intl.NumberFormat().format(creditsClaimed)
        }}
      </h1>
      <h4 class="q-ma-none q-mt-md-lg text-center" style="font-size: clamp(18px, 2vw, 25px)">Credits Claimed</h4>
    </div>
    <div :class="['col-md-4 col-12 column justify-center items-center', $q.screen.lt.md ? 'q-mt-lg' : '']">
      <h1 id="job-count" class="text-primary q-ma-none" style="font-weight: 500; font-size: clamp(40px, 5vw, 60px)">
        {{
          jobsProtected > 9999 ?
            Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(jobsProtected)
            : Intl.NumberFormat().format(jobsProtected)
        }}
      </h1>
      <h4 class="q-ma-none q-mt-md-lg text-center" style="font-size: clamp(18px, 2vw, 25px)">Jobs Protected</h4>
    </div>
  </div>
</template>

<script>
  import {date} from 'quasar';

  export default {
    name: 'TimelineCounts',
    data() {
      return {
        businessesReached: 250,
        creditsClaimed: 41505231,
        jobsProtected: 4829,
      };
    },
    mounted() {
      this.addTotals();
      this.initCount();
    },
    methods: {
      formatNumber(num) {
        if (num > 9999) {
          return Intl.NumberFormat('en-US', {
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format(num);
        } else {
          return Intl.NumberFormat('en-US', {
            maximumFractionDigits: 0
          }).format(num);
        }
      },

      addTotals() {
        let businessesReached = 557;
        let creditsClaimed = 41550432;
        let jobsProtected = Math.floor(creditsClaimed / 7000);
        let today = new Date();
        let firstDay = date.buildDate({month: 5, date: 30, year: 2022});
        let daysDiff = Math.abs(date.getDateDiff(today, firstDay, 'days'));
        let perDay = 15;
        let totalDay = 3201053;
        let empDay = Math.floor(totalDay / 7000);
        this.businessesReached = businessesReached + (perDay * daysDiff);
        this.creditsClaimed = creditsClaimed + (totalDay * daysDiff);
        this.jobsProtected = jobsProtected + (empDay * daysDiff);
      },
      initCount() {
        const animateValue = (obj, start, stat, duration) => {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = stat.format(progress * (stat.value - start) + start);
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        };

        const stats = {
          businesses: {
            value: this.businessesReached,
            format: val => {
              return this.formatNumber(val);
            },
          },
          credits: {
            value: this.creditsClaimed,
            format: val => {
              return `$${this.formatNumber(val)}`;
            },
          },
          jobs: {
            value: this.jobsProtected,
            format: val => {
              return this.formatNumber(val);
            },
          },
        };

        animateValue(document.getElementById('business-count'), 0, stats.businesses, 2000);
        animateValue(document.getElementById('credit-count'), 0, stats.credits, 2000);
        animateValue(document.getElementById('job-count'), 0, stats.jobs, 2000);
      },
    },
  };
</script>

<style scoped>

</style>
