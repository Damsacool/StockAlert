import * as usersApi from '../api/users.api';

export const userService = {
  async getMe() {
    return usersApi.getMe();
  },

  async updateMe(payload) {
    return usersApi.updateMe(payload);
  },

  async createWorker(payload) {
    return usersApi.createWorker(payload);
  },

  async getWorkers() {
    return usersApi.getWorkers();
  },
};
