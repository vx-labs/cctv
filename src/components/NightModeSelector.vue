<template>
  <v-list nav dense>
    <v-list-item @click="$vuetify.theme.dark=!$vuetify.theme.dark">
      <v-list-item-icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-list-item-icon>
      <v-list-item-title> Switch theme to {{ $vuetify.theme.dark? 'light': 'dark' }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

})
</script>