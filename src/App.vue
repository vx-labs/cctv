<template>
  <v-app>
    <AppDrawer></AppDrawer>
    <v-app-bar height="73" app flat>
      <v-spacer></v-spacer>
      <v-toolbar-title>
        <v-icon>mdi-cctv</v-icon>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app></v-footer>
  </v-app>
</template>

<script lang="ts">
import AppDrawer from "@/components/AppDrawer.vue";
import Vue from 'vue'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'App',
  components: { AppDrawer },
  methods: {
    ...mapActions(["handleAuthentication"])
  },
  async mounted() {
    await this.handleAuthentication();
    if (this.$store.getters.authenticated) {
      (async () => {
        await this.$store.dispatch('refreshUsername');
        this.$store.dispatch('startMQTTClient');
      })();
      if (
        window.location.search.includes("code=")) {
        const lastPath = this.$store.getters.lastPath;
        if (lastPath !== undefined) {
          this.$router.replace(lastPath);
        } else {
          this.$router.replace(window.location.pathname);
        }
      }
    } else {
      console.log('auth failed')
    }
  },
});
</script>