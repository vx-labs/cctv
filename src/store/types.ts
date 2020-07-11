import { ApiClient } from './services/api.service';
export interface AccountInformations {
  id: string;
  usernames: string[];
}
export interface CreateDeviceRequest {
  name: string;
  password: string;
  active: boolean;
}
export interface Device {
  id: string;
  name: string;
  createdAt: number;
  active: boolean;
  password: string;
  connected: boolean;
  receivedBytes: number;
  sentBytes: number;
  subscriptionCount: number;
  humanStatus: string;
  pendingAsyncAction: boolean;
}
export class Api {
  client = new ApiClient('https://api.iot.cloud.vx-labs.net');
}