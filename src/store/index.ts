import Vue from 'vue'
import Vuex from 'vuex'
import { connect, MqttClient } from 'mqtt';
import session from './modules/session'
import { Api, Device } from './types';

Vue.use(Vuex)

let instance = localStorage.getItem('cctv:instance');
if (instance === null) {
  instance = Math.random().toString(36).substr(2, 8);
  localStorage.setItem('cctv:instance', instance);
}


class MqttState {
  connected = false;
  connecting = false;
  offlineReason = '';
  clientId = `cctv-console-${instance}`
  client?: MqttClient = undefined;
}


function matchPattern(topic: string, pattern: string): boolean {
  const topicTokens = topic.split('/');
  const patternTokens = pattern.split('/');

  let i = 0;
  for (const lt = topicTokens.length; i < lt; i++) {
    if (patternTokens[i] === '#') {
      return true;
    } else if (patternTokens[i] !== '+' && patternTokens[i] !== topicTokens[i]) {
      return false;
    }
  }

  if (patternTokens[i] === '#') {
    i += 1;
  }

  return (i === patternTokens.length) ? true : false;
}

interface Camera {
  name: string;
  state: string;
  lastFrame?: string;
}

export class MainState {
  username?: string = undefined;
  api = new Api();
  cameras = ([] as Camera[]);
  alarmArmed = false;
  mqtt = new MqttState();
}

export default new Vuex.Store({
  state: new MainState(),
  getters: {
    isMQTTConnecting(state) { return state.mqtt.connecting },
    isMQTTConnected(state) { return state.mqtt.connected },
    username(state) { return state.username },
    cameras(state) { return state.cameras },
    isAlarmArmed(state) { return state.alarmArmed },
  },
  mutations: {
    usernameSet(state, username: string) {
      state.username = username;
    },
    alarmArmed(state) { state.alarmArmed = true },
    alarmDisarmed(state) { state.alarmArmed = false },
    mqttStarted(state, client: MqttClient) { state.mqtt.client = client },
    mqttConnected(state) { state.mqtt.connecting = false; state.mqtt.connected = true; },
    mqttConnecting(state) { state.mqtt.connected = false; state.mqtt.connecting = true; },
    mqttDisconnected(state, reason: string) { state.mqtt.offlineReason = reason; state.mqtt.connected = false; },
    cameraDiscovered(state, name: string) { state.cameras.push({ name: name, state: 'lost' }); state.cameras.sort((a, b) => { return a.name.localeCompare(b.name) }) },
    cameraFrameUpdated(state, opts: { name: string; frame: string }) {
      const idx = state.cameras.findIndex(elt => elt.name === opts.name);
      if (idx > -1) {
        Vue.set(state.cameras, idx, Object.assign({}, state.cameras[idx], { lastFrame: opts.frame }))
      }
    },
    cameraStateUpdated(state, opts: { name: string; state: string }) {
      const idx = state.cameras.findIndex(elt => elt.name === opts.name);
      if (idx > -1) {
        Vue.set(state.cameras, idx, Object.assign({}, state.cameras[idx], { state: opts.state }))
      }
    }
  },
  actions: {
    async refreshUsername({ state, dispatch, commit }) {
      const token = await dispatch('refreshToken', {}, { root: true });
      try {
        const info = await state.api.client.getAccountInformations(token);
        commit('usernameSet', info.usernames[0]);
      } catch (err) {
        const info = await state.api.client.createAccount(token);
        commit('usernameSet', info.usernames[0]);
      }
    },
    async refreshFrame({ state }, name: string) {
      if (state.cameras.some(elt => elt.name === name)) {
        return new Promise((resolve, reject) => {
          if (state.mqtt.client == undefined) { resolve(); return; }
          state.mqtt.client.publish(`devices/${name}/dafang/frame/set`, 'true', { qos: 1 }, (err) => {
            if (!err) { resolve() } else { reject(err) }
          });
        });
      } else { throw new Error("unknown camera") }
    },
    async moveCameraX({ state, dispatch }, opts: { steps: number; name: string }) {
      if (state.cameras.some(elt => elt.name === opts.name)) {
        return new Promise((resolve, reject) => {
          if (state.mqtt.client == undefined) { resolve(); return; }
          state.mqtt.client.publish(`devices/${opts.name}/dafang/x_axis_incr/set`, opts.steps.toString(), { qos: 1 }, (err) => {
            if (!err) { resolve() } else { reject() }
          });
        });
      }
    },
    async moveCameraY({ dispatch, state }, opts: { steps: number; name: string }) {
      if (state.cameras.some(elt => elt.name === opts.name)) {
        return new Promise((resolve, reject) => {
          if (state.mqtt.client == undefined) { resolve(); return; }
          state.mqtt.client.publish(`devices/${opts.name}/dafang/y_axis_incr/set`, opts.steps.toString(), { qos: 1 }, (err) => {
            if (!err) { resolve() } else { reject() }
          });
        });
      }
    },
    async startMQTTClient({ commit, state, getters, dispatch }) {
      commit('mqttConnecting');
      const token = await dispatch('refreshToken');
      const devices = await state.api.client.listDevices(token);
      const oldSelf = devices.find(elt => elt.name === state.mqtt.clientId);
      if (oldSelf !== undefined) {
        await state.api.client.deleteDevice(token, oldSelf.id);
      }

      const password = Math.random().toString(36).substr(2, 16);

      await state.api.client.createDevice(token, { active: true, name: state.mqtt.clientId, password });

      const client = connect('wss://broker.iot.cloud.vx-labs.net:443/mqtt', {
        connectTimeout: 3 * 1000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clientId: state.mqtt.clientId,
        username: state.username,
        password: password,
        host: 'broker.iot.cloud.vx-labs.net',
        hostname: 'broker.iot.cloud.vx-labs.net',
      });
      commit('mqttStarted', client);
      client.on('message', (topic, message) => {
        const t = topic.toString()
        if (matchPattern(t, 'devices/+/dafang/frame')) {
          if (message.length > 0) {
            const tokens = t.split('/');
            commit('cameraFrameUpdated', { name: tokens[1], frame: message.toString('base64') });
          }
        } else if (matchPattern(t, 'devices/+/$nodes')) {
          const tokens = t.split('/')
          if (message.toString().split(',').some(elt => elt === 'dafang')) {
            if (!state.cameras.some(elt => elt.name === tokens[1])) {
              commit('cameraDiscovered', tokens[1]);
              client.subscribe(`devices/${tokens[1]}/dafang/#`, { qos: 1 })
              client.subscribe(`devices/${tokens[1]}/$state`, { qos: 1 })
            }
          }
        } else if (matchPattern(t, 'devices/+/$state')) {
          const tokens = t.split('/');
          if (state.cameras.some(elt => elt.name === tokens[1])) {
            commit('cameraStateUpdated', { name: tokens[1], state: message.toString() });
          }

        } else if (matchPattern(t, 'devices/+/$homie')) {
          const tokens = t.split('/');
          if (message.toString().startsWith('3.')) {
            client.subscribe(`devices/${tokens[1]}/$nodes`, { qos: 1 })
          }
        } else if (matchPattern(t, 'devices/$broadcast/alarm')) {
          if (message.toString() == 'arm') {
            commit('alarmArmed');
          } else {
            commit('alarmDisarmed')
          }
        }
      });
      client.on('connect', () => {
        client.subscribe('devices/$broadcast/alarm', { qos: 1 });
        client.subscribe('devices/+/$homie', { qos: 1 }, (err) => {
          if (err === null) {
            commit('mqttConnected');
          } else {
            console.log(err);
          }
        })
      });
      client.on('error', (err) => commit('mqttDisconnected', err));
      client.on('reconnect', () => { commit('mqttConnecting') });
      client.on('disconnect', () => { commit('mqttDisconnected', 'Broker ask us to disconnect') });
    },
  },
  modules: {
    session,
  }
})
