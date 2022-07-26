<template>
  <q-list padding class="q-pa-sm rounded-borders text-primary" style="max-width: 280px;">
    <q-expansion-item v-model="expandedContacts"
                      switch-toggle-side>
      <template v-slot:header>
        <q-item-section>
          PEOPLE
        </q-item-section>

        <q-item-section side>
          <div class="flex">
            <q-btn round dense flat icon="more_vert" @click.stop/>
            <q-btn round dense flat icon="add" @click.stop/>
          </div>
        </q-item-section>
      </template>

      <q-item v-for="contact in contacts"
              :key="contact.id"
              class="q-my-sm"
              clickable
              v-ripple
              :active="current === contact.id"
              @click="current = contact.id"
              active-class="my-menu-link"
              style="border-radius: 2em;">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            <template v-if="contact.avatar">
              <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`">
            </template>
            <template v-else>
              {{ contact.letter }}
            </template>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ contact.name }}</q-item-label>
          <q-item-label caption lines="1">{{ contact.email }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chat_bubble" :color="contact.online ? 'green' : 'grey'"/>
        </q-item-section>
      </q-item>
    </q-expansion-item>

    <q-separator spaced/>

    <q-expansion-item v-model="expandedRooms"
                      switch-toggle-side>
      <template v-slot:header>
        <q-item-section>
          ROOMS
        </q-item-section>

        <q-item-section side>
          <div class="flex">
            <q-btn round dense flat icon="more_vert" @click.stop/>
            <q-btn round dense flat icon="add" @click.stop/>
          </div>
        </q-item-section>
      </template>

      <q-item v-for="room in rooms"
              :key="room.id"
              class="q-mb-sm"
              clickable
              v-ripple
              :active="current === room.id"
              @click="current = room.id"
              active-class="bg-accent"
              style="border-radius: 2em;">
        <q-item-section avatar>
          <q-avatar>
            <q-icon :name="room.icon"></q-icon>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label lines="2">{{ room.name }}</q-item-label>
        </q-item-section>

      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
  export default {
    name: 'chatNav',
  };
</script>

<style scoped>

</style>
