<template>
  <v-list nav dense>
    <v-list-item :disabled="isMQTTConnecting || !isMQTTConnected">
      <v-list-item-icon>
        <v-progress-circular indeterminate width="2" v-if="isMQTTConnecting"></v-progress-circular>
        <span v-else>
          <v-icon v-if="isMQTTConnected">mdi-cloud-outline</v-icon>
          <v-icon v-else>mdi-cloud-off-outline</v-icon>
        </span>
      </v-list-item-icon>
      <v-list-item-title>{{ isMQTTConnecting? 'Connecting...': isMQTTConnected? 'Connected' : 'Disconnected' }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters(["isMQTTConnected", "isMQTTConnecting"]),
  }
})
</script>