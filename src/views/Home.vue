<template>
  <v-container fluid>
    <v-overlay v-if="!isAlarmArmed" opacity="0.8" absolute>
      Alarm is currently disarmed.
    </v-overlay>
    <v-row>
      <v-col xs="12" md="6" v-for="camera in cameras" :key="camera.name">
        <CameraView :camera="camera" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapGetters } from 'vuex';
import CameraView from '@/components/CameraView.vue'

export default {
  name: 'Home',
  components: {
    CameraView,
  },
  computed: {
    ...mapGetters(['cameras', 'isAlarmArmed']),
  }
}
</script>
