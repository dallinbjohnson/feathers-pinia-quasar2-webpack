<template>
    <div :class="`${col_class} col-12`" v-if="show">
        <div :class="`row row_class`">
        <div>
        <p
                :class="text_class"
                :color="color"
        >{{text}}
        </p>
        <p v-if="caption"
           class="caption mt-n4 ml-3"
           :color="caption_color"
        >{{caption_text}}</p>
        </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'FormText',
    props: {
      show: {
        type: Boolean,
        default: true
      },
      text: {
        type: String,
        default: '',
        required: true
      },
      col_class: {
        type: String,
        default: '',
        required: false
      },
      row_class: {
        type: String,
        default: '',
        required: false
      },
      text_class: {
        type: String,
        default: 'title',
        required: true
      },
      color: {
        type: String,
        default: '#424242',
        required: false
      },
      caption: {
        type: Boolean,
        default: false,
        required: false
      },
      caption_color: {
        type: String,
        default: '#424242',
        required: false
      },
      caption_text: {
        type: String,
        default: '',
        required: false
      }
    }
  };
</script>
