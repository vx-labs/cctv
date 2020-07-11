/* eslint-disable */

import { Auth0Client } from '@auth0/auth0-spa-js';


export default class Authenticator {
  private auth0: Auth0Client;
  constructor(domain: string, clientID: string) {
    this.auth0 = new Auth0Client({
      domain: domain,
      client_id: clientID,
      redirect_uri: window.location.origin + '/login',
      cacheLocation: "localstorage",
      connection: 'google-oauth2',
      audience: 'https://api.iot.cloud.vx-labs.net',
    })
  }

  login(appState?: string) {
    return this.auth0.loginWithRedirect({
      appState: appState,
    });
  }
  logout() {
    const keys = Object.keys(localStorage);
    let i = keys.length;

    while (i--) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith('@@auth0')) {
        localStorage.removeItem(key);
        break;
      }
    }

    return this.auth0.logout({
      returnTo: window.location.origin,
    });
  }
  async handleAuthentication(): Promise<any> {
    try {
      await this.auth0.getTokenSilently();
      return;
    } catch {
      const result = await this.auth0.handleRedirectCallback();
      return result.appState
    }
  }
  async userProfile(): Promise<any> {
    return this.auth0.getUser();
  }
  async token(): Promise<string> {
    return await this.auth0.getTokenSilently();
  }
}