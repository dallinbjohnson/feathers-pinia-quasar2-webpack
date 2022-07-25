<template>
  <div class="modal-content">
    <tab-navbar></tab-navbar>
    <slot name="header" class="modal-header">
      <span class="close"></span>
      <div>{{header}} || This is a Header</div>
    </slot>
    <div class="modal-body">
      <p>Some text in the Modal Body</p>
      <p>Some other text...</p>
    </div>
    <slot name="footer" class="modal-footer">
      <div>{{footer}} || This is a footer</div>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'MessageDialogue',
    components: {
    },
    props: {
      header: {
        type: String
      },
      footer: {
        type: String
      }
    }
  };
</script>

<style scoped lang="scss">
/* Modal Header */
.modal-header {
  padding: 6px 8px;
  background-color: #5cb85c;
  color: white;
}

/* Modal Body */
.modal-body {
  padding: 6px 8px;
}

/* Modal Footer */
.modal-footer {
  padding: 6px 8px;
  background-color: #5cb85c;
  color: white;
}

/* Modal Content */
.modal-content {
  position: relative;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 80%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  animation-name: animatetop;
  animation-duration: 0.9s
}

/* Add Animation */
@keyframes animatetop {
  from {
    top: 0px;
    opacity: 0
  }
  to {
    top: 0;
    opacity: 1
  }
}
</style>
