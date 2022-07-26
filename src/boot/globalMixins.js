import { boot } from 'quasar/wrappers';

import {colors} from 'quasar';
import {mapGetters} from 'vuex';

export default boot(({app}) => {
  app.mixin({
    computed: {
      ...mapGetters('auth', {
        $authUser: 'user',
        $activeLogin: 'activeLogin',
        $activeAccount: 'activeAccount',
      }),
    },
    methods: {
      $scrollTo(options = {}){
        let { id } = options;
        if(id){
          let el = document.getElementById(id);
          if(el){
            let top = el.getBoundingClientRect().top;
            window.scrollTo({
              top: top,
              behavior: 'smooth'
            });
          }
        }
      },
      // eslint-disable-next-line no-unused-vars
      $lightenHex(cssVar, amt = 40) {
        let color = this.$getCssVar(cssVar);
        let r = colors.hexToRgb(color);
        return `rgba(${r.r + amt}, ${r.g + amt}, ${r.b + amt}, ${!this.$lisEmpty(r.a) ? r.a / 100 : '1'})`;
      },
      $wpbHighlight(words, query) {
        if (!query) return words;
        let low_search_list = query.toLowerCase().trim().split(/[ ,]+/);
        let iQuery = new RegExp(low_search_list.join('|'), 'ig');

        return words.toString().replace(iQuery, function (matchedTxt) {
          return ('<span style=\'color: blue; background-color: lightgrey; padding: 0 3px\'>' + matchedTxt + '</span>');
        });
      },
    },
  });
});
