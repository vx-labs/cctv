<template>
  <v-hover v-slot:default="{ hover }">
    <v-card outlined :elevation="hover ? 4 : 0" :class="{ 'on-hover': hover }">
      <v-img dark class="white--text align-end" :src="encodedImage">
        <v-overlay opacity="0.8" v-if="camera.state !== 'ready'" absolute>
         {{ camera.name }} is unavailable ({{ camera.state }}).
        </v-overlay>
        <v-row v-else align="end" justify="space-around">
          <v-col>
            <v-card-title>{{ camera.name }}</v-card-title>
          </v-col>
          <v-col cols="3">
            <v-row no-gutters>
              <v-col>
                <v-spacer />
              </v-col>
              <v-col>
                <v-btn icon @click="moveCameraY({ name: camera.name, steps: 50})">
                  <v-icon>mdi-menu-up</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-spacer />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-btn icon @click="moveCameraX({ name: camera.name, steps: -150})">
                  <v-icon>mdi-menu-left</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn icon @click="refresh">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-btn icon @click="moveCameraX({ name: camera.name, steps: 150})">
                  <v-icon>mdi-menu-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-spacer />
              </v-col>
              <v-col>
                <v-btn icon @click="moveCameraY({ name: camera.name, steps: -50})">
                  <v-icon>mdi-menu-down</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-spacer />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'CameraView',
  props: {
    camera: Object,
  },
  computed: {
    encodedImage(): string {
      return `data:image/jpeg;base64,${this.camera.lastFrame}`;
    },
  },
  methods: {
    refresh() { this.$store.dispatch('refreshFrame', this.camera.name) },
    ...mapActions(['moveCameraX', 'moveCameraY'])
  }
});
</script>
