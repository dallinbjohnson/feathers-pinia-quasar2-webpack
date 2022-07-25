<template>
  <div :id="`font-picker${pickerSuffix}`" class="font-picker" :title="state.errorText">
    <button class="dropdown-button" type="button"
            :class="{expanded: state.expanded}"
            @click="toggleExpanded"
            @keypress="toggleExpanded">
      <p class="dropdown-font-name">{{state.activeFont}}</p>
      <p class="dropdown-icon" :class="state.loadingStatus"></p>
    </button>
    <ul v-if="state.loadingStatus === 'finished' && fontManager.fonts"
        :class="{expanded: state.expanded}"
        @scroll="onScroll">
      <li v-for="font in fontManager.fonts" :key="font.family">
        <button type="button"
                :class="`font-${snakeCase(font.family)}${pickerSuffix} ${font.family === state.activeFont ? 'active-font' : ''}`"
                @click="itemClick(font)"
                @keypress="itemClick(font)">{{font.family}}</button>
      </li>
    </ul>
  </div>
</template>

<script>
  import { FontManager } from 'font-picker';
  export default {
    name: 'FontPicker',
    props: ['activeFont', 'apiKey', 'options'],
    data() {
      return {
        state: {
          activeFont: this.activeFont,
          errorText: '',
          expanded: false,
          loadingStatus: 'loading' // possible values: 'loading', 'finished', 'error'
        },
        pickerSuffix: '',
        fontManager: null,
      };
    },
    mounted() {
      // Determine selector suffix from font picker's name
      if (this.options && this.options.name) {
        this.pickerSuffix = `-${this.options.name}`;
      } else {
        this.pickerSuffix = '';
      }
      // Initialize FontManager object and generate the font list
      this.fontManager = new FontManager(
        this.apiKey,
        this.activeFont,
        this.options
      );
      this.fontManager.init()
        .then(() => {
          // font list has finished loading
          this.setState({
            errorText: '',
            loadingStatus: 'finished'
          });
        })
        .catch((err) => {
          // error while loading font list
          this.setState({
            errorText: 'Error trying to fetch the list of available fonts',
            loadingStatus: 'error'
          });
          console.error(this.state.errorText);
          console.error(err);
        });
    },
    watch: {
      activeFont() {
        if (this.state.activeFont !== this.activeFont) {
          this.setActiveFont(this.activeFont);
        }
      },
    },
    methods: {
      /**
       * Set state object
       */
      setState(state) {
        this.state = Object.assign(this.state, state);
      },
      /**
       * EventListener for closing the font picker when clicking anywhere outside it
       */
      onClose(e) {
        let targetElement = e.target; // clicked element
        do {
          if (targetElement === document.getElementById('font-picker')) {
            // click inside font picker
            return;
          }
          // move up the DOM
          targetElement = targetElement.parentNode;
        } while (targetElement);
        // click outside font picker
        this.toggleExpanded();
      },
      /**
       * Download the font previews for all visible font entries and the five after them
       */
      onScroll(e) {
        const elementHeight = e.target.scrollHeight / this.fontManager.fonts.length;
        const downloadIndex = Math.ceil((e.target.scrollTop + e.target.clientHeight) / elementHeight);
        this.fontManager.downloadPreviews(downloadIndex + 5);
      },
      /**
       * Set the font with the given font list index as the active one
       */
      setActiveFont(fontFamily) {
        const activeFontIndex = this.fontManager.setActiveFont(fontFamily);
        if (activeFontIndex === -1) {
          // error trying to change font
          this.setState({
            activeFont: fontFamily,
            errorText: `Cannot update activeFont: The font "${fontFamily}" is not in the font list`,
            loadingStatus: 'error'
          });
          console.error(this.state.errorText);
        } else {
          // font change successful
          this.setState({
            activeFont: fontFamily,
            errorText: '',
            loadingStatus: 'finished'
          });
        }
      },
      /**
       * Expand/collapse the picker's font list
       */
      toggleExpanded() {
        this.setState({
          expanded: !this.state.expanded
        });
      },
      snakeCase(text) {
        return text.replace(/\s+/g, '-').toLowerCase();
      },
      itemClick(font) {
        this.toggleExpanded();
        this.$emit('change', font);
      }
    },
  };
</script>

<style lang="scss">
  .font-picker {
    position: relative;
    display: inline-block;
    width: 200px;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
    * {
      box-sizing: border-box;
    }
    p {
      margin: 0;
      padding: 0;
    }
    button {
      background: none;
      border: 0;
      color: inherit;
      cursor: pointer;
      font-size: inherit;
      outline: none;
    }
    .dropdown-button {
      height: 35px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      background: #CBCBCB;
      &:hover, &.expanded, &:focus {
        background: #bebebe;
      }
      .dropdown-font-name {
        overflow: hidden;
        white-space: nowrap;
      }
      &.expanded .dropdown-icon.finished:before {
        -webkit-transform: rotate(-180deg);
        transform: rotate(-180deg);
      }
    }
    .dropdown-icon {
      margin-left: 10px;
      &.loading:before {
        content: '';
        display: block;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        border: 2px solid #b2b2b2;
        border-top-color: black;
        -webkit-animation: spinner 0.6s linear infinite;
        animation: spinner 0.6s linear infinite;
      }
      &.finished:before {
        content: '';
        display: block;
        height: 0;
        width: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid black;
        transition: -webkit-transform 0.3s;
        transition: transform 0.3s, -webkit-transform 0.3s;
        margin: 0 2px;
      }
      &.error:before {
        content: '⚠';
      }
    }
    ul {
      position: absolute;
      z-index: 1;
      max-height: 0;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0;
      padding: 0;
      background: #EAEAEA;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
      transition: 0.3s;
      &.expanded {
        max-height: 200px;
      }
      li {
        height: 35px;
        list-style: none;
        button {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0 10px;
          white-space: nowrap;
          &:hover, &:focus {
            background: #dddddd;
          }
          &.active-font {
            background: #d1d1d1;
          }
        }
      }
    }
  }
  @-webkit-keyframes spinner {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes spinner {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
