<template>
  <v-container>
    <h2 class="text-h2">VX-Labs CCTV Platform</h2>
    <v-row class="ma-4">
      <span class="font-weight-light">
        Greetings !
        <br />Welcome to VX-Labs CCTV Platform.
        <br />From here, you can login into your account, or read some documentation about the platform.
        <br />
      </span>
    </v-row>
    <v-row class="ma-4">
      <v-card outlined class="ma-2" :loading="authenticationPending">
        <v-list>
          <v-subheader>Login</v-subheader>
          <v-list-item-group>
            <v-list-item @click="doLogin()">
              <v-list-item-icon>
                <v-icon>mdi-login</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Access your account</v-list-item-title>
                <v-list-item-subtitle>
                  <span
                    class="font-weight-light"
                  >Access your account, or create a new one, by clicking this link</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item to="/support">
              <v-list-item-icon>
                <v-icon>mdi-email</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Contact support</v-list-item-title>
                <v-list-item-subtitle>
                  <span class="font-weight-light">Got technical issues? Contact support now.</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      <v-card outlined class="ma-2">
        <v-list>
          <v-subheader>Learn more</v-subheader>
          <v-list-item-group>
            <v-list-item to="/about">
              <v-list-item-icon>
                <v-icon>mdi-book</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>CCTV Platform</v-list-item-title>
                <v-list-item-subtitle>
                  <span class="font-weight-light">What's this platform?</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(["authenticated", "authenticationPending"]),
  },
  methods: {
    ...mapActions(["login"]),
    doLogin() {
      const searchParams = new URLSearchParams(window.location.search);
      return this.login(searchParams.get('lastPage'));
    },
    doCheck() {
      if (this.authenticated) {
        const searchParams = new URLSearchParams(window.location.search);
        this.$router.replace(searchParams.get('lastPage'))
      }
    }
  },
  mounted() {
    this.$nextTick(() => this.doCheck());
  },
  watch: {
    authenticated() {
      this.doCheck();
    },
  }
}
</script>