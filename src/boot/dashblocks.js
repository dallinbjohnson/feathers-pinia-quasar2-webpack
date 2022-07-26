import { boot } from 'quasar/wrappers';

import {
  DashBlocks,
  DbDashboard,
  DbHorizon,
  DbSunburst,
  DbSankey,
  DbRidgeline,
  DbChartjsBar,
  DbChartjsHorizontalBar,
  DbChartjsDoughnut,
  DbChartjsLine,
  DbChartjsPie,
  DbChartjsPolarArea,
  DbChartjsRadar,
  DbChartjsBubble,
  DbChartjsScatter,
  DbNumber,
  DbEasyPie,
  DbTrendLine,
  DbTrendBar,
  DbSparkline,
  DbDygraphsBar,
  DbDygraphsLine,
  DbDygraphsSparkLine,
  DbDygraphsDateTimeHistogram
} from 'dashblocks';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';

import 'dashblocks/src/assets/scss/dashblocks.scss';

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default boot(({app}) => {
  app.use(DashBlocks, {
    components: {
      DbDashboard,
      DbHorizon,
      DbSunburst,
      DbSankey,
      DbRidgeline,
      DbChartjsBar,
      DbChartjsHorizontalBar,
      DbChartjsDoughnut,
      DbChartjsLine,
      DbChartjsPie,
      DbChartjsPolarArea,
      DbChartjsRadar,
      DbChartjsBubble,
      DbChartjsScatter,
      DbNumber,
      DbEasyPie,
      DbTrendLine,
      DbTrendBar,
      DbSparkline,
      DbDygraphsBar,
      DbDygraphsLine,
      DbDygraphsSparkLine,
      DbDygraphsDateTimeHistogram
    }
    //components: dashblocksComponents
  });
  app.use(VueGoodTablePlugin);

});


