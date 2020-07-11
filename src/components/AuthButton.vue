<template>
  <v-list nav dense>
    <v-list-item @click="toogleAuthentication">
      <v-list-item-icon>
        <v-icon v-if="authenticated">mdi-logout</v-icon>
        <v-icon v-else>mdi-login</v-icon>
      </v-list-item-icon>
      <v-list-item-title v-html="authenticated? 'Logout': 'Login'"></v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
export default Vue.extend({
  name: 'AuthButton',
  computed: {
    ...mapGetters(['authenticated'])
  },
  methods: {
    ...mapActions(['toogleAuthentication'])
  }
})
</script>