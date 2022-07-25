<template>
  <q-page id="chats" class="q-mx-sm-md flex flex-center">
    <drawered-cards title="Chats">
      <template v-slot:leftDrawer>
        <chat-room-list @select-room="selectRoom"></chat-room-list>
      </template>

      <chat-box :value="{room: currentRoom}" style="width: 100%"></chat-box>
    </drawered-cards>

  </q-page>
</template>

<script>
  import DraweredCards from 'components/common/atoms/layouts/draweredCards/draweredCards';
  import ChatRoomList from 'components/chats/ChatRoomList/ChatRoomList';
  import ChatBox from 'components/chats/ChatBox/ChatBox';

  export default {
    name: 'Messages',
    components: {
      ChatBox,
      ChatRoomList,
      DraweredCards,
    },
    data() {
      return {
        link: 'inbox',
        roomsDrawer: true,
        options: [],

        currentRoom: null,
      };
    },
    methods: {
      selectRoom(room) {
        this.currentRoom = room;
      }
    },
  };
</script>

<style scoped lang="scss" src="./_chats.scss">

</style>
