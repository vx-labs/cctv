<template>
  <v-navigation-drawer v-if="authenticated" app permanent expand-on-hover>
    <v-list dense>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="profile.picture"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ profile.given_name}} {{ profile.family_name.toUpperCase()}}</v-list-item-title>
          <v-list-item-subtitle>{{ profile.email}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item link to="/">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Home page</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <NightModeSelector></NightModeSelector>
      <MQTTStatus></MQTTStatus>
      <AuthButton></AuthButton>
    </template>
  </v-navigation-drawer>
</template>
<script lang="ts">
import NightModeSelector from "@/components/NightModeSelector.vue";
import MQTTStatus from "@/components/MQTTStatus.vue";
import AuthButton from "@/components/AuthButton.vue";
import { mapGetters } from 'vuex'

import Vue from 'vue'
export default Vue.extend({
  components: { AuthButton, MQTTStatus, NightModeSelector },
  computed: {
    ...mapGetters(["authenticated", "profile"])
  },
})
</script>